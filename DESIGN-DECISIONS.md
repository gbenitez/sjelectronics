# Decisiones de diseño — rediseño SJ Electronics

Resumen de las decisiones tomadas en el rediseño (negro/rojo/blanco, mobile-first) y el porqué.
Ver también el plan original de la sesión y `README.md` para la parte técnica.

## Problema de partida

El sitio anterior no representaba a la marca: hero con foto oscurecida hasta perder el producto,
rojo institucional ausente (el acento visible era un turquesa ajeno a la identidad), logo blanco
ilegible a tamaño pequeño, y una estética genérica de plantilla que no dialogaba con el feed de
Instagram (@sj_electronics, 369 mil seguidores) — donde sí hay contraste, energía y producto grande.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `sj-black` | `#0A0A0A` | Fondo modo oscuro, texto sobre claro |
| `sj-graphite` | `#1A1A1C` | Superficies elevadas en oscuro |
| `sj-red` (brand-primary-600) | `#B00711` | Rojo institucional: texto de marca, bordes, subrayado activo |
| `sj-red-bright` (brand-primary-500) | `#E10600` | Acento vivo: CTAs, focus ring, estados activos |
| `sj-white` | `#FFFFFF` | — |
| `sj-off-white` (neutral-50) | `#F7F6F4` | Fondo modo claro, blanco cálido (no gris azulado) |

El rojo es **acento**, nunca fondo de pantalla completa ni de bloques largos de texto — aparece en
botones primarios, subrayado de navegación activa, categoría activa, íconos de bloques de
confianza y la franja de cierre del Home/Quiénes somos. La escala `brand.secondary` (antes azul
`#2563EB`) pasó a ser una escala neutra negra: checkboxes, switches y el link de breadcrumb dejaron
de usar un segundo color de marca.

**Contraste verificado (WCAG AA)**:
- `sj-red` (#B00711) sobre blanco → 7.3:1 (texto normal, holgado).
- `sj-red-bright` (#E10600) sobre negro (#0A0A0A) → 4.0:1 — suficiente para texto grande/gráficos
  (≥3:1) pero no para texto pequeño; por eso las etiquetas `text-xs` sobre fondo negro fijo
  (ej. "Catálogo", "Cobertura") usan `brand-primary-400` (#F53D3D, 5.3:1) en vez de 500.
- Blanco sobre negro → 19.8:1.

## Tipografía

- **Display**: Archivo (peso 600–900, con italic real). Tracking ligeramente negativo en
  titulares grandes; el italic se reserva para frases puntuales de cierre (ej. "*más cerca de
  ti*" en la franja roja del Home), no para todos los H1 — evita que el recurso pierda fuerza.
- **Cuerpo**: Inter, 16–18px, line-height 1.6 en texto general; en artículos de blog se sube a
  17px/1.75 para lectura cómoda en columnas de hasta 70ch.
- Se retiró Montserrat (única familia que usaba el sitio anterior tanto para display como body).

## Ritmo de espaciado

Secciones con `py-14/16/20` (mobile→desktop) o `py-16/20/24` en bandas de mayor jerarquía, mismo
`max-w-7xl` y gutters (`px-4 sm:px-6 lg:px-8`) en las 5 pantallas. Cuando dos secciones consecutivas
comparten fondo negro (ej. categorías → destacados en Home), se reduce el padding de unión para
evitar el "vacío" de casi 200px que deja sumar dos paddings grandes sobre el mismo color.

## Tratamiento fotográfico

- Producto grande, con su exposición e iluminación real — nunca lavado ni oscurecido.
- **Overlay del hero**: se reemplazó el velo uniforme (negro al 70% sobre toda la imagen, que era
  el problema original) por un **degradado direccional** (`bg-gradient-to-r from-sj-black/85
  via-sj-black/35 to-transparent`): oscurece solo la zona donde vive el texto (izquierda) y deja
  el producto/foto con su color real a la derecha.
- En tarjetas de categoría/valores se usa un degradado inferior (`from-sj-black/85 to-transparent`)
  solo para legibilidad del texto sobre la imagen, sin tocar el resto de la foto.
- Donde no hay foto real todavía (air fryer, sandwichera, parrilla, olla, repuestos), se crearon
  ilustraciones planas de marca (rojo/negro sobre `#FFF1F1`) en vez de dejar el ícono gris
  genérico de "imagen rota" — `imagen/placeholders/demo-*.svg`.

## Criterio del hero

Producto protagonista y legible ante todo. Máximo 3 slides si se mantiene carrusel, autoplay
pausable al hover/focus, indicadores con `aria-current`, flechas rediseñadas (círculo sutil,
`backdrop-blur`, sin invadir el texto — bug corregido: en mobile las flechas llegaban a solaparse
con títulos largos porque el contenedor de texto no reservaba espacio para ellas). El Home usa
CTA dual fijo (Ver catálogo / Escríbenos por WhatsApp) en vez de un solo botón por slide, para no
atar la llamada a la acción a qué imagen esté rotando en ese momento.

## Otras decisiones puntuales

- **Componentes de estado** (éxito/error en el formulario de contacto): el éxito usa borde negro +
  ícono de check en vez de un tono rojo tenue, para no confundirse visualmente con el estado de
  error (que sí es rojo) dentro de una paleta de solo 3 colores.
- **Sin backend de correo**: el formulario de Contacto no inventa un "mensaje enviado a nuestro
  servidor" — valida en el cliente y abre WhatsApp con el mensaje ya armado, que es el canal de
  contacto real del sitio.
- **Sin datos inventados**: teléfono, horario y correo de Contacto, cifras de "Quiénes somos"
  (años en el mercado, distribuidores activos) y el dominio de `sitemap.xml` quedan marcados
  `TODO`/"Próximamente" en vez de rellenarse con datos ficticios.
