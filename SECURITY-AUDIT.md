# Auditoría de seguridad — SJ Electronics

Fecha: 2026-08-08
Alcance: código de este proyecto (frontend Vue 3 + proxy PHP) y, cuando fue posible,
la instalación de WordPress configurada como origen de datos.

## Metodología y alcance real aplicado

- **No se pudo probar en vivo el WordPress del cliente.** El dominio configurado como
  ejemplo en `.env` (`www.gb-vnzl.com` / `gb-vnzl.com`) resuelve a un bucket S3 detrás de
  CloudFront que devuelve `AccessDenied` en `/wp-json/` — no es una instalación WordPress
  activa, sino un placeholder de una sesión anterior (coincide con el commit
  `194cdb9 "ejemplo producción gb-vnzl/Vercel"`). Probar más a fondo un dominio de
  titularidad no confirmada está fuera del alcance autorizado, así que no se siguió
  sondeando. La sección de superficie REST de WordPress queda como checklist de código +
  pasos a correr manualmente contra la URL real de producción cuando se confirme.
- Sí se auditó completo: el bundle compilado (`dist/`), el código Vue, los 5 proxies PHP,
  `.env*`, dependencias npm (`npm audit`) y configuración de despliegue (`deploy/`,
  ausencia de `vercel.json`).

## Tabla de hallazgos (por severidad)

| ID | Área | Descripción | Severidad | Impacto real en este proyecto | Evidencia | Corrección propuesta |
|---|---|---|---|---|---|---|
| **S1** | XSS / `v-html` | El sanitizador casero (`sanitizeHtml`) es una lista negra por regex, no una lista blanca. No cubre atributos **sin comillas** (`<img src=x onerror=alert(1)>` no matchea `/on\w+="[^"]*"/`), ni tags peligrosos (`<iframe>`, `<object>`, `<embed>`, `<style>`, `<base>`, `<form>`, `<svg><use>`). El contenido llega directo de `content.rendered`/`excerpt.rendered` de WordPress (posts) y de `descriptionHtml` de productos — cualquier autor con permiso de edición en WP (o el fallback si algún día se alimenta de una fuente menos confiable) puede inyectar JS ejecutable. | **Crítica** | Ejecución de JS arbitrario en el navegador del visitante (phishing, redirecciones, keylogging del formulario de contacto, defacement). Único punto real de XSS almacenado del sitio. | `src/pages/PostDetailPage.vue:124-131`, `src/pages/ProductDetailPage.vue:377-384` (uso: `PostDetailPage.vue:51`, `ProductDetailPage.vue:178`) | Reemplazar el regex por **DOMPurify** con allowlist estricta de tags/atributos, en un composable único `useSanitizedHtml`, y eliminar los dos `sanitizeHtml` duplicados. |
| **S2** | XSS / URLs no validadas | `product.documents.specSheet.url` se renderiza directo en `:href` sin validar esquema. Si ese campo (ACF/custom field en WP) contiene `javascript:...`, se ejecuta al hacer click. `publicAssetUrl()` además permite explícitamente `data:` y `blob:` para cualquier asset, incluyendo el link "pantalla completa" de la galería (`<a :href target=_blank>`). | **Alta** | XSS activado por click en botones que parecen inofensivos ("Ficha técnica", ampliar imagen). Requiere que alguien con acceso de edición en WP (o el JSON mock) ponga una URL maliciosa — pero es exactamente el vector que un CMS multiautor debe asumir como hostil. | `src/pages/ProductDetailPage.vue:132` (`:href="product?.documents?.specSheet?.url \|\| '#'"`), `:href="imgSrc(activeImage)"` en la misma página; `src/utils/publicAssetUrl.js:12` (`data:`/`blob:` permitidos sin razón) | Helper `safeHref()` que solo permite `http:`, `https:`, `mailto:`, `tel:` (y rutas relativas); si no matchea, devuelve `#`/`null`. Quitar el passthrough de `data:`/`blob:` en `publicAssetUrl`. |
| **S3** | Info disclosure — proxy PHP | El flag de debug (`?debug=1`) es público y sin autenticar en los 5 endpoints (`wp-products.php`, `wp-product.php`, `wp-posts.php`, `wp-post.php`, `wp-product-categories.php`). Cualquiera puede pedir `https://tu-sitio.com/api/wp-products.php?debug=1` y obtener la URL exacta del WordPress origen, el host, y el status/error de la conexión upstream — incluida la IP directa si `WP_API_BASE` apunta a una IP. | **Alta** | Si el sitio está detrás de un WAF/CDN, esto revela el origen real y permite bypassear esa protección atacando la IP directo. También confirma arquitectura interna a un atacante haciendo reconocimiento, sin dejar rastro fuera de lo normal. | `api/wp_env_defaults.php:113-121` (`sj_api_debug_request()` lee `$_GET['debug']` sin control de acceso), usado en las 5 rutas | Eliminar el disparador por query string. Dejar solo la variable de entorno `WP_API_DEBUG` (controlada por el operador en el servidor, no por un visitante). |
| **S4** | Info disclosure — errores siempre visibles | Los campos `error.detail` (mensaje crudo de cURL/`file_get_contents`) y, en `wp-products.php`, `error.url` (URL upstream completa) se devuelven en las respuestas 502/500 sin necesidad de `?debug=1`, a cualquier llamante. `file_get_contents` en el fallback sin cURL además incluye rutas/mensajes de PHP tal cual. | **Media** | Fuga de nombres de host internos / mensajes de conexión en el camino de error normal (WordPress caído, timeout) — no requiere ningún flag especial. | `api/wp-products.php:326-328,360-362`; mismo patrón (`detail`) en `wp-product.php:307`, `wp-post.php:251`, `wp-posts.php:248`, `wp-product-categories.php:247,297` | Quitar `detail`/`url` de la respuesta pública; loguear el detalle con `error_log()` server-side y devolver solo un mensaje genérico + `status`. |
| **S5** | Transporte — WordPress | `WP_TLS_INSECURE=1` desactiva `CURLOPT_SSL_VERIFYPEER`/`VERIFYHOST` cuando está activo. Está seteado en el `.env` local de desarrollo (no en `.env.production.example`), como solución al problema "cert es del dominio, no de la IP". | **Media** (alta si llega a producción) | Si esta variable se copia al `.env` de producción, el tráfico proxy↔WordPress queda expuesto a MITM sin que el usuario lo note (tráfico servidor-a-servidor). | `.env:14` (no versionado), lógica en `api/wp_env_defaults.php:193-204` | No es un bug de código — el mecanismo ya es opt-in explícito. Corrección real: acción de infraestructura (certificado válido para el dominio o conectar por dominio en vez de IP; nunca desactivar la verificación en producción). |
| **S6** | Cabeceras de seguridad — frontend | No existe `vercel.json` ni bloque de `add_header` en el nginx de ejemplo con CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`/`X-Frame-Options` ni HSTS para el sitio estático. El backend PHP sí las trae (`api/*.php` ya setea CSP/nosniff/no-referrer). | **Media** | Sin `frame-ancestors`/`X-Frame-Options`: el sitio se puede embeber en un `<iframe>` de un dominio malicioso (clickjacking sobre el formulario de contacto o el WhatsApp CTA). Sin CSP en el HTML, si se explota S1 no hay una segunda capa que lo mitigue. | No existe `vercel.json`; `deploy/nginx.example.conf` sin bloque de headers | Agregar cabeceras en `vercel.json` (o en el nginx de ejemplo). |
| **S7** | Resiliencia / observabilidad | El fallback trata cualquier fallo (red caída, timeout, HTTP 401/403/500) exactamente igual: cae al catálogo local en silencio. Un WordPress que empiece a exigir autenticación o que bloquee el proxy por IP se ve idéntico, desde el frontend, a "sin internet". | **Media** | Un problema de permisos/seguridad real en WordPress queda enmascarado como "modo demo" indefinidamente, sin alerta. | `src/composables/useCatalogSource.js` (`fetchJson`, todos los `catch`) | Diferenciar el log según el status: si es `401/403`, registrar un `console.warn`/log distinto al de timeout/red, para que monitoreo lo pueda detectar. |
| **S8** | Dependencias | `npm audit`: 1 crítica, 9 altas, 3 moderadas — todas en devDependencies (vite, vitest, postcss, rollup y transitivas: esbuild, ws, nanoid, picomatch, form-data, brace-expansion, @vitest/mocker, vite-node). Ninguna se envía al bundle de producción (`vue` es la única dependency real). | **Media** (build/CI y máquina de desarrollo, no el sitio público) | El más relevante en la práctica: esbuild permite que cualquier sitio web mande requests al dev server y lea la respuesta — riesgo mientras corre `npm run dev`, mitigado porque Vite no expone el server fuera de `localhost` hoy. El crítico de Vitest (lectura arbitraria de archivos) solo aplica con `vitest --ui`, que este proyecto no usa. | `npm audit` | Correr `npm audit fix` (sin `--force`) para las que tienen fix no-mayor. Vite 5→8 y Vitest 2→4 requieren bump mayor — requiere validación manual antes de aplicar. |
| **S9** | Hardening de código (confirmado, no requiere cambio) | `<component :is="CurrentPage">` (router) y `<component :is="iconComponent">` (SJToast) ya son seguros hoy — ambos resuelven contra un mapa/objeto fijo local, nunca contra un string crudo de la API o de la URL. | **Info** | — | `src/App.vue:28-37`, `src/components/SJToast.vue` | Ninguna — dejar constancia (y considerar un comentario "por qué es seguro" para que no se cambie a un lookup dinámico sin querer). |
| **S10** | Config del repo | `.env.production.example` (versionado en git) trae el dominio real de producción (`gb-vnzl.com`) y la URL real de Vercel (`sj-seven-murex.vercel.app`). No es un secreto, pero un archivo "example" no debería llevar infraestructura real. | **Baja** | Reconocimiento pasivo, no explotable por sí solo. | `.env.production.example:4,17` | Reemplazar por placeholders y mover los valores reales a `.env.production` (ya gitignored). |
| **S11** | Cache en disco compartido | El cache HTTP del proxy usa `sys_get_temp_dir()` con nombre de archivo `sha1($url)` — en hosting compartido con `/tmp` común a varios procesos/tenants, es legible/predecible. | **Baja** | Contenido cacheado es catálogo público (no sensible); impacto real bajo, pero permite tampering del catálogo mostrado durante el TTL en un tmp compartido. | `api/wp-products.php:135-142` (mismo patrón en los otros proxies) | Acción de hosting: directorio de cache dedicado con permisos restringidos al usuario del pool PHP-FPM. |
| **S12** | Rate limiting | Ninguno de los 5 proxies limita peticiones por IP. | **Media** | Amplificación: el proxy puede usarse para saturar el WordPress del cliente. | Ausencia de control en `api/*.php` | No resoluble solo en PHP stateless de forma confiable en hosting compartido; rate limiting a nivel Nginx/WAF. |
| **S13** | Formulario de contacto | No hay backend (por diseño: valida en cliente y abre WhatsApp con el mensaje armado). Rate limiting, CSRF, honeypot/captcha, sanitización server-side no aplican hoy porque no hay servidor que reciba ni procese el envío. | **Info / N/A hoy** | Ninguno mientras se mantenga este diseño. | `src/pages/ContactPage.vue` | Ninguna corrección de código ahora. Si en el futuro se agrega backend real (email, guardado en WP), todos los controles del punto 6 del brief pasan a ser obligatorios. |

## Lo que ya está bien (no tocar "por las dudas")

- Sin credenciales de WordPress en ningún lado — ni en el bundle, ni en `api/*.php`. Todo el acceso es REST público de solo lectura.
- Los 5 proxies PHP ya tienen: allowlist de host anti-SSRF (`WP_PRODUCTS_ALLOWED_HOSTS`), esquema restringido a `http`/`https`, rechazo de credenciales embebidas en la URL, límite de bytes y timeout, CORS por allowlist (nunca `*`), método restringido a `GET/HEAD/OPTIONS`, `display_errors=0`.
- `Cache-Control: private` en las respuestas del proxy — correcto, evita cache compartido/CDN de estas respuestas.
- Sin Pinia, sin tokens/sesión en `localStorage` (solo la preferencia de tema).
- Bundle de producción sin sourcemaps, sin secretos (verificado con `npm run build` + grep sobre `dist/`), sin `console.log` de datos de la app.
- `.env`/`.env.local`/`.env.production` correctamente en `.gitignore`, nunca commiteados (confirmado en `git log --all`).

## Nota sobre `.env.local`

`.env.local` (no versionado) contiene un `VERCEL_OIDC_TOKEN` generado por el CLI de Vercel.
Se verificó que expiró en marzo de 2026 (token muerto, sin riesgo actual) y que nunca se
commiteó al repositorio. Se generan tokens nuevos automáticamente en cada `vercel dev`/`link`;
no requiere acción salvo higiene general de no compartir ese archivo.

## Parches aplicados

| ID | Cambio | Archivos |
|---|---|---|
| S1 | Sanitizador regex reemplazado por DOMPurify con allowlist de tags/atributos, `rel=noopener noreferrer` forzado en links `target=_blank`, esquemas de URL restringidos (`ALLOWED_URI_REGEXP`) | nuevo `src/composables/useSanitizedHtml.js`; usado en `PostDetailPage.vue`, `ProductDetailPage.vue` (se eliminó el `sanitizeHtml` duplicado de cada uno) |
| S2 | `publicAssetUrl()` ya no acepta `data:`/`blob:` (solo `http(s)`/rutas relativas); nuevo `safeHref()` con allowlist `http/https/mailto/tel` aplicado a la "Ficha técnica" del producto y al `href` de slides del hero | `src/utils/publicAssetUrl.js`, `src/pages/ProductDetailPage.vue`, `src/components/SJHeroSlideshow.vue` |
| S3 | Se quitó el disparador público `?debug=1`; el modo debug queda solo por variable de entorno `WP_API_DEBUG`, controlada por el operador del servidor | `api/wp_env_defaults.php` |
| S4 | Se quitaron `error.detail`/`error.url` de las respuestas públicas de error; el detalle ahora se registra con `error_log()` (nueva función `sj_log_upstream_error()`) | `api/wp_env_defaults.php`, `api/wp-products.php`, `api/wp-product.php`, `api/wp-post.php`, `api/wp-posts.php`, `api/wp-product-categories.php` |
| S6 | Cabeceras de seguridad (CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS) para el frontend estático | nuevo `vercel.json`; agregado a `deploy/nginx.example.conf` (+ `server_tokens off;`) |
| S7 | Un `console.warn` distingue explícitamente 401/403 (auth/permisos) de otros fallos en el fetch al proxy, en vez de tratarlos igual que "sin red" | `src/composables/useCatalogSource.js` |
| S8 | `npm audit fix` (sin `--force`): resueltas 8 de 13 (brace-expansion, form-data, js-cookie, nanoid, picomatch, postcss, rollup, ws) | `package.json`, `package-lock.json` |
| S10 | Dominio real y URL de Vercel reemplazados por placeholders en el archivo de ejemplo | `.env.production.example` |

## Checklist de verificación (antes / después)

| Verificación | Antes | Después |
|---|---|---|
| `<img src=x onerror=alert(1)>` en contenido de post/producto | Se ejecuta (regex no cubre atributos sin comillas) | Bloqueado por DOMPurify — verificado con payload real en consola del navegador |
| `<a href="javascript:...">`, `<iframe>`, `<svg><use>` en contenido | Pasaban sin filtrar (excepto `<script>`) | Removidos/neutralizados por DOMPurify — verificado |
| `product.documents.specSheet.url = "javascript:..."` | Se ejecuta al hacer click en "Ficha técnica" | `safeHref()` lo descarta, el botón queda deshabilitado |
| Imagen con `image: "data:text/html,..."` | `publicAssetUrl` la dejaba pasar tal cual | `publicAssetUrl` devuelve `null`, no se renderiza |
| `GET /api/wp-products.php?debug=1` (sin autenticar) | Devolvía headers `X-SJ-WP-Endpoint`/`X-SJ-Upstream-*` con la URL/host real de WordPress | Sin headers `X-SJ-*` — verificado con y sin `.env` local; `WP_API_DEBUG=1` server-side sigue funcionando igual que antes |
| Respuesta 502 de cualquier proxy (WordPress caído) | Incluía `error.detail` con el mensaje crudo de cURL/`file_get_contents` (a veces con host/ruta) | Solo `message` genérico + `status`; el detalle va a `error_log()` |
| Cabeceras de seguridad del frontend (Vercel/Nginx) | Ninguna (`curl -I` no mostraba CSP/X-Frame-Options/HSTS) | CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS configurados |
| Fallback ante 401/403 de WordPress | Idéntico a "sin red", sin ningún rastro | `console.warn` distintivo en consola del navegador |
| `npm audit` | 1 crítica, 9 altas, 3 moderadas | 1 alta, 1 crítica, 3 moderadas restantes — **todas exigen bump mayor de Vite/Vitest** (ver abajo), resto resuelto |
| `.env.production.example` (versionado) | Dominio real `gb-vnzl.com` y URL real de Vercel | Placeholders (`tu-wordpress.com`, `tu-dominio.com`) |
| Suite de tests (`npx vitest run`) | 33/33 | 33/33 (sin regresiones) |
| Build de producción (`npm run build`) | OK, sin sourcemaps, sin secretos en `dist/` | OK, sin sourcemaps, sin secretos en `dist/`; nuevo chunk `useSanitizedHtml` (~30 kB, carga diferida) |

## Pendiente — requiere tu decisión explícita

- **S8 (resto)**: `vite` 5→8 y `vitest` 2→4 necesitan `npm audit fix --force` (bump mayor). No lo apliqué porque puede haber breaking changes en la config de Vite/Vitest. Si querés, lo hago en una rama aparte y corro toda la suite + build antes de fusionar.
- **Nota lateral (no es uno de los 13 hallazgos)**: en PHP 8.5 (el que hay en esta máquina), `http_get()` en los 5 proxies dispara un warning `Deprecated: $http_response_header...` que se filtra al *body* de la respuesta pese a `display_errors=0`, revelando la ruta del archivo. No lo toqué por estar fuera del alcance acordado — el `deploy/nginx.example.conf` ya documentado apunta a PHP 8.2 (donde esto no ocurre), pero si el hosting real corre PHP 8.5 hay que decidir si lo corrijo (cambiar a `http_get_last_response_headers()`).

## Acciones que dependen del hosting o de WordPress (no resolubles desde este repo)

1. **S5 — Nunca `WP_TLS_INSECURE=1` en producción.** Conseguir un certificado válido para el
   dominio real (Let's Encrypt/ACM) y usar `WP_API_BASE="https://tu-dominio.com/..."` en vez de
   la IP directa. Si hoy se conecta por IP porque el certificado es solo del dominio, ese es
   exactamente el síntoma a resolver con el certificado correcto, no desactivando la verificación.
2. **S11 — Cache del proxy en disco compartido.** Si el hosting es compartido, crear un directorio
   de cache dedicado (`chmod 700`, dueño = usuario del pool PHP-FPM) y apuntar `cache_paths()` ahí
   en vez de `sys_get_temp_dir()`. En VPS/contenedor propio el riesgo es marginal.
3. **S12 — Rate limiting.** Agregar `limit_req_zone`/`limit_req` en Nginx (o el WAF del hosting)
   para `location ~ ^/api/.+\.php$`, por ejemplo 10 req/s por IP con burst, para que el proxy no
   pueda usarse para amplificar tráfico hacia el WordPress origen.
4. **Superficie REST de WordPress (sección 2 del brief original)** — correr esto contra el
   dominio real de producción (no pude validarlo, ver nota de alcance al inicio):
   ```bash
   curl -s https://TU-WORDPRESS-REAL.com/wp-json/wp/v2/users        # debe dar 401/403 o [] para anónimos
   curl -s https://TU-WORDPRESS-REAL.com/wp-json/wp/v2/media?per_page=1
   curl -s https://TU-WORDPRESS-REAL.com/wp-json/wp/v2/settings     # debe requerir auth
   curl -s "https://TU-WORDPRESS-REAL.com/?rest_route=/wp/v2/users" # vía alterna con permalinks custom
   ```
   Si `/wp/v2/users` devuelve nombres/slugs de autor sin autenticar: agregar en `functions.php`
   (o mu-plugin) un filtro `rest_endpoints` que quite `/wp/v2/users` para peticiones anónimas, o
   instalar un plugin de hardening REST (ej. "Disable REST API" selectivo, no el endpoint completo
   ya que el proxy de este proyecto necesita `/wp/v2/product/` y `/wp/v2/posts/` públicos).
5. **XML-RPC y `wp-login.php`.** Desactivar `xmlrpc.php` si no se usa (plugin o regla de servidor
   que bloquee `/xmlrpc.php`), y poner límite de intentos en `/wp-login.php` (plugin tipo Limit
   Login Attempts, o regla `limit_req` en Nginx apuntada a esa ruta).
6. **Rol del usuario de integración.** Confirmar que no exista ningún usuario de WordPress con
   credenciales usadas por este proyecto (no debería haber ninguna — el acceso es 100% REST
   público de lectura, confirmado en esta auditoría). Si en el futuro se agrega escritura, el
   usuario de esa integración debe tener el rol mínimo posible, nunca Administrator.
7. **`DISALLOW_FILE_EDIT`, `wp-config.php`, uploads sin ejecución de PHP.** En `wp-config.php`:
   `define('DISALLOW_FILE_EDIT', true);`. Bloquear `.php` dentro de `wp-content/uploads/` a nivel
   de servidor (Nginx: `location ~* /wp-content/uploads/.*\.php$ { deny all; }`). Desactivar listado
   de directorios (`autoindex off;` en Nginx, ya suele venir off por defecto).
8. **Actualizaciones y monitoreo.** Core/plugins/PHP al día; 2FA para todos los administradores;
   WAF (Cloudflare/Sucuri/similar) delante del dominio; backups automáticos verificados
   (restaurar de prueba periódicamente, no solo confirmar que el backup "corrió"); monitoreo de
   integridad de archivos (ej. Wordfence, o un cron simple con checksums).
9. **Meta generator / versión de WordPress.** Quitar el tag `<meta name="generator">` (filtro
   `remove_action('wp_head', 'wp_generator')`) y revisar que los headers HTTP del hosting no
   anuncien versión de PHP (`expose_php = Off` en `php.ini`) ni de Nginx (ya cubierto arriba con
   `server_tokens off;`).
