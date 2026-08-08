# SJ Electronics — sitio + sistema de diseño

Sitio de SJ Electronics (electrodomésticos para el hogar y la cocina: air fryers, sandwicheras,
parrillas, ollas, licuadoras y repuestos). Vue 3 + Vite + Tailwind CSS en el frontend, con un
proxy PHP hacia la REST API de WordPress y un catálogo/blog local de respaldo cuando WordPress
no está disponible.

Ver también [`DESIGN-DECISIONS.md`](./DESIGN-DECISIONS.md) para el resumen de paleta,
tipografía, ritmo visual y tratamiento fotográfico del rediseño.

## Inicio rápido

```bash
npm install

npm run dev        # Solo frontend (Vite). Sin PHP, el sitio usa el catálogo/posts locales.
npm run dev:php     # Solo el proxy PHP en 127.0.0.1:8081
npm run dev:full     # Frontend + PHP juntos (recomendado si querés probar contra WordPress)

npm test            # Suite de tests (Vitest)
npm run build        # Build de producción (dist/)
npm run build:deploy  # Build + copia api/*.php y los JSON de fallback a dist/api/
npm run preview       # Sirve el build de producción localmente
```

## Conectar con WordPress (`WP_API_BASE`)

1. Copiá `.env.example` a `.env`.
2. Definí `WP_API_BASE` apuntando a la REST API de tu WordPress, por ejemplo:
   ```
   WP_API_BASE="https://tu-wordpress.com/wp-json/wp/v2"
   ```
3. Corré `npm run dev:full` (o `npm run dev:php` en otra terminal) para que el proxy PHP
   (`api/wp-products.php`, `api/wp-product.php`, `api/wp-product-categories.php`,
   `api/wp-posts.php`, `api/wp-post.php`) reenvíe las peticiones a ese WordPress.

Variables opcionales relevantes (ver `.env.example` para la lista completa): `WP_PRODUCTS_ALLOWED_HOSTS`
(whitelist anti-SSRF, obligatoria si cambiás `WP_API_BASE`), `WP_TLS_INSECURE` (solo si conectás
por IP sin certificado válido), `WP_PRODUCTS_TIMEOUT`/`WP_PRODUCTS_PER_PAGE`/`WP_PRODUCTS_CACHE_TTL`.

## Activar/desactivar el fallback local

El fallback **no se activa manualmente**: se activa solo, automáticamente, cuando el frontend no
puede completar la petición al proxy PHP (sin red, WordPress caído, timeout de 5s agotado,
respuesta HTTP ≠ 2xx o JSON inválido). La lógica vive en un único módulo,
[`src/composables/useCatalogSource.js`](./src/composables/useCatalogSource.js), que:

- Intenta la API con timeout de 5s y 1 reintento.
- Si falla, usa los datos locales (`src/data/fallback-catalog.json` y `src/data/fallback-posts.json`).
- Normaliza ambos orígenes a la misma forma, así ninguna pantalla necesita saber de dónde vino el dato.
- Expone `isFallback` para mostrar el aviso discreto ("Mostrando catálogo/artículos de demostración")
  que ya usan `ProductsPage`, `ProductDetailPage`, `PostsHeroPage`, `PostDetailPage` y el bloque de
  destacados del Home.

Para **forzar** el modo fallback en desarrollo (probar la UI sin depender de WordPress), simplemente
corré `npm run dev` sin `npm run dev:php`: las llamadas a `/api/*.php` fallarán y el sitio cae al
catálogo/posts locales automáticamente.

El mismo `fallback-catalog.json` es la fuente única también del lado PHP
(`api/fallback_lib.php` lo lee directo, y `npm run build:deploy` lo copia a `dist/api/`), así que
nunca hay dos catálogos de respaldo desincronizados entre frontend y backend.

## Editar los mocks (catálogo y posts)

- **Productos**: `src/data/fallback-catalog.json`. Cada producto acepta
  `id, slug, name, model, category, categoryName, image, images[], excerpt, descriptionHtml, attributes[]`.
  Las categorías válidas están en `CATEGORY_ORDER` dentro de `useCatalogSource.js`
  (`air-fryers`, `sandwicheras`, `parrillas`, `ollas`, `licuadoras`, `repuestos`).
- **Posts**: `src/data/fallback-posts.json`. Cada post acepta
  `id, slug, title, category, excerpt, date, image, contentHtml`. El tiempo de lectura se calcula
  solo (≈200 palabras/min) a partir de `contentHtml`, no se declara a mano.
- Las imágenes de los mocks viven en `imagen/placeholders/` (algunas son fotos reales, otras
  ilustraciones SVG de marca creadas para categorías sin foto todavía — ver `demo-*.svg`).

## Estructura del proyecto

```
sj/
├── api/                     # Proxy PHP hacia WordPress + fallback (fuente: src/data/fallback-*.json)
├── src/
│   ├── components/          # Sistema de componentes (SJButton, SJCard, SJInput, SJHeroSlideshow, ...)
│   ├── composables/         # useCatalogSource (datos), usePageMeta (SEO), useHashRoute (router)
│   ├── data/                 # fallback-catalog.json, fallback-posts.json
│   ├── layouts/               # SiteHeader, SiteFooter
│   ├── pages/                  # Inicio, Productos, Detalle, Quiénes somos, Contacto, Posts
│   ├── App.vue                  # Router por hash + code splitting por página
│   └── style.css
├── imagen/                   # publicDir de Vite: banners, logos, placeholders, robots.txt, sitemap.xml
├── deploy/                   # Config de referencia para Nginx/Docker
└── tailwind.config.js        # Tokens de marca (paleta, tipografía, radios, sombras)
```

## Sistema de diseño

Tokens principales en `tailwind.config.js`:

- **Colores**: `sj.black` `#0A0A0A`, `sj.red` `#B00711`, `sj.redBright` `#E10600`, `sj.white`,
  `sj.offWhite` `#F7F6F4`. `brand.primary` (escala roja institucional) y `brand.secondary`
  (escala neutra negra, usada en checkboxes/switches/focus antes turquesa/azul).
- **Tipografía**: `font-display` = Archivo (bold/black, con italic en frases clave),
  `font-body` = Inter.
- Detalle completo de la decisión de paleta/tipografía/ritmo/fotografía en
  [`DESIGN-DECISIONS.md`](./DESIGN-DECISIONS.md).

Componentes reutilizables en `src/components/` (prefijo `SJ`): `SJButton`, `SJCard`, `SJBadge`,
`SJInput`, `SJSelect`, `SJCheckbox`, `SJSwitch`, `SJTable`, `SJModal`, `SJToast`, `SJTabs`,
`SJBreadcrumb`, `SJProductCard`, `SJBannerCarousel`, `SJHeroSlideshow`, `SJMobileDrawer`,
`SJWhatsAppButton`.

## Accesibilidad y SEO

- Contraste AA verificado para el rojo institucional sobre blanco y negro (ver notas en
  `DESIGN-DECISIONS.md`); foco visible en rojo (`.focus-ring`) en todos los interactivos.
- Drawer mobile y modal con `role="dialog"`, `aria-modal`, foco atrapado y cierre por `Esc`.
- `src/composables/usePageMeta.js` actualiza `<title>`, meta description, Open Graph/Twitter y
  JSON-LD (`Product` en detalle de producto, `Article` en detalle de post) en cada navegación.
  Limitación conocida: al no haber SSR, un crawler que no ejecute JS solo ve los valores por
  defecto de `index.html`.
- `imagen/robots.txt` y `imagen/sitemap.xml` (editar el dominio real antes de publicar — están
  marcados con `TODO`).

## Tests

```bash
npm test          # una corrida
npm run test:watch # modo watch
```

## Despliegue

Ver `deploy/nginx.example.conf`, `deploy/nginx.docker.conf` y `docker-compose.yml`. Flujo típico:

```bash
npm run build:deploy   # genera dist/ con el front + api/*.php + fallback-*.json
# servir dist/ con Nginx + PHP-FPM, o con docker compose (ver docker-compose.yml)
```

## Licencia

© 2026 SJ Electronics. Todos los derechos reservados.
