/**
 * URL del catálogo PDF. Vive en la biblioteca de medios de WordPress (no en el repo:
 * son 13 MB y no tienen por qué viajar en cada build/deploy del front).
 *
 * Al subir el sitio solo cambia el host de WordPress: define
 *   VITE_CATALOG_PDF_URL="https://tu-wordpress.com/wp-content/uploads/2026/09/catalogo-sj-2026.pdf"
 * en el .env del entorno (o .env.production) y no hay que tocar código.
 *
 * Por defecto apunta al WordPress local de desarrollo.
 */
const FALLBACK = 'http://localhost/wordpress/wp-content/uploads/2026/09/catalogo-sj-2026.pdf'

export const CATALOG_PDF_URL = import.meta.env.VITE_CATALOG_PDF_URL || FALLBACK
