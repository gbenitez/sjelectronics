/**
 * SEO por pantalla para una SPA sin SSR: actualiza <title>, meta description,
 * Open Graph/Twitter y, opcionalmente, JSON-LD en cada navegación de ruta.
 * Limitación conocida: como no hay render en servidor, crawlers que no ejecutan
 * JS solo verán los valores por defecto de index.html.
 */
import { toValue, watchEffect } from 'vue'

const SITE_NAME = 'SJ Electronics'
export const DEFAULT_DESCRIPTION =
  'Electrodomésticos para el hogar y la cocina: air fryers, sandwicheras, parrillas, ollas, licuadoras y repuestos. Más cerca de ti.'
export const DEFAULT_IMAGE = '/Logotipo-Red-sin-fondo.png'

function setMetaTag(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLinkTag(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * @param {{title?: any, description?: any, image?: any, path?: any, type?: any}} options
 * Cada valor puede ser string, ref o computed.
 */
export function usePageMeta(options = {}) {
  watchEffect(() => {
    const rawTitle = toValue(options.title)
    const description = toValue(options.description) || DEFAULT_DESCRIPTION
    const image = toValue(options.image) || DEFAULT_IMAGE
    const path = toValue(options.path) || ''
    const type = toValue(options.type) || 'website'

    const fullTitle = rawTitle ? `${rawTitle} · ${SITE_NAME}` : `${SITE_NAME} — Más cerca de ti`
    document.title = fullTitle

    setMetaTag('name', 'description', description)
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', type)
    setMetaTag('property', 'og:site_name', SITE_NAME)
    setMetaTag('property', 'og:image', image)
    if (path) setMetaTag('property', 'og:url', `${window.location.origin}${window.location.pathname}#${path}`)
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', image)

    if (path) setLinkTag('canonical', `${window.location.origin}${window.location.pathname}#${path}`)
  })
}

/** Inserta/actualiza un bloque JSON-LD identificado por `id`. Pasa `null` para quitarlo. */
export function useJsonLd(id, dataRef) {
  watchEffect(() => {
    const data = toValue(dataRef)
    let el = document.getElementById(id)
    if (!data) {
      if (el) el.remove()
      return
    }
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = id
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(data)
  })
}
