/**
 * Número de WhatsApp de SJ Electronics — único lugar donde se configura para todo el sitio
 * (botón flotante, hero del Home, Contacto, catálogo de Productos y detalle de producto).
 *
 * Formato E.164 SIN el "+" (el que pide wa.me), ej. Venezuela: 58 + código de área sin el 0
 * + número → "584121234567".
 *
 * TODO: reemplazar con el número real de SJ Electronics.
 * Mientras esté vacío, wa.me abre el selector de contacto de WhatsApp en vez de un chat directo
 * (no se inventa un teléfono).
 */
export const WHATSAPP_PHONE = ''

/** Arma el link de WhatsApp con el mensaje ya cargado, usando WHATSAPP_PHONE si está definido. */
export function whatsappLink(message) {
  const text = encodeURIComponent(message)
  return WHATSAPP_PHONE ? `https://wa.me/${WHATSAPP_PHONE}?text=${text}` : `https://wa.me/?text=${text}`
}
