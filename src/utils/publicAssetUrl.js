/**
 * Rutas bajo `imagen/` (publicDir de Vite): se publican en la raíz del sitio.
 * Respeta `base` del build (p. ej. subcarpeta). URLs absolutas http(s) se devuelven igual.
 *
 * @param {string|null|undefined} path
 * @returns {string|null}
 */
export function publicAssetUrl(path) {
  if (path == null || path === '') return null
  const s = String(path).trim()
  if (/^https?:\/\//i.test(s)) return s
  // Nunca data:/blob:: las imágenes de este sitio son siempre archivos reales (WP o imagen/),
  // nunca contenido embebido; aceptar esos esquemas solo abriría una vía de XSS/spoofing
  // innecesaria si algún día un campo de imagen viene de una fuente menos confiable.
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return null
  const rel = s.replace(/^\/+/, '')
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${encodeURI(rel)}`
}

/**
 * Para usar en :href de <a>. Solo permite esquemas inofensivos (http/https/mailto/tel) o
 * rutas relativas/hash internas. Cualquier otra cosa (javascript:, data:, vbscript:, etc.)
 * se descarta. Úsalo con cualquier URL que venga de una API externa (WordPress, mocks).
 */
export function safeHref(href) {
  if (href == null) return null
  const s = String(href).trim()
  if (s === '') return null
  // Relativas o anclas internas (#/ruta, /ruta, ?query): sin esquema, seguras.
  if (/^[#/?]/.test(s)) return s
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(s)
  if (!m) return s // sin esquema explícito (p.ej. "www.foo.com/x") — se trata como relativo/texto
  const scheme = m[1].toLowerCase()
  return ['http', 'https', 'mailto', 'tel'].includes(scheme) ? s : null
}
