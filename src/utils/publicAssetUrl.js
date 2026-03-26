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
  if (s.startsWith('data:') || s.startsWith('blob:')) return s
  const rel = s.replace(/^\/+/, '')
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${encodeURI(rel)}`
}
