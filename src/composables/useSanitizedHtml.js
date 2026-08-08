/**
 * Sanitización única de HTML remoto (posts/productos de WordPress) con DOMPurify,
 * usando una allowlist explícita de tags/atributos. Nunca usar v-html sin pasar por acá:
 * un regex casero (lo que había antes) no cubre atributos sin comillas, tags como
 * <iframe>/<object>/<svg><use> ni variantes de ofuscación.
 */
import DOMPurify from 'dompurify'
import { computed, unref } from 'vue'

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
  'h2', 'h3', 'h4',
  'ul', 'ol', 'li',
  'a', 'img',
  'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption',
]

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'target', 'rel']

// Solo esquemas de link inofensivos; bloquea javascript:, data:, vbscript:, etc.
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i

DOMPurify.setConfig({
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOWED_URI_REGEXP,
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'base'],
  FORBID_ATTR: ['style', 'srcset'],
})

// target=_blank sin rel=noopener es un riesgo (la pestaña nueva puede acceder a window.opener).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export function sanitizeHtml(html) {
  return DOMPurify.sanitize(String(html || ''))
}

/** Devuelve un computed con el HTML ya sanitizado, listo para v-html. */
export function useSanitizedHtml(htmlRef) {
  return computed(() => sanitizeHtml(unref(htmlRef)))
}
