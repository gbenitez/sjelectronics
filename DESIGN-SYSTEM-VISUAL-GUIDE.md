# SJ Electronics - Guía Visual del Sistema de Diseño

## 🎨 Paleta de Colores

### Brand Colors

#### Primary (Rojo Corporativo)
```
██ #FFF1F1  50  - Fondos muy sutiles
██ #FFE0E0  100 - Fondos sutiles, hover
██ #FFC2C2  200 - Bordes suaves
██ #FF9494  300 - Bordes medios
██ #FF5C5C  400 - Iconos secundarios
██ #E11D2A  500 - Texto sobre blanco
██ #C9141F  600 - 🔴 CTAs PRINCIPALES
██ #A80F18  700 - Hover de CTAs
██ #860B12  800 - Pressed states
██ #5C050A  900 - Texto oscuro
```

#### Secondary (Azul)
```
██ #EFF6FF  50  - Fondos sutiles
██ #DBEAFE  100 - Elementos seleccionados
██ #BFDBFE  200 - Bordes suaves
██ #93C5FD  300 - Bordes medios
██ #60A5FA  400 - Iconos
██ #2563EB  500 - Focus rings
██ #1D4ED8  600 - 🔵 LINKS
██ #1E40AF  700 - Links hover
██ #1E3A8A  800 - Estados activos
██ #172554  900 - Texto oscuro
```

### Neutral (Grises)
```
██ #FFFFFF  0   - Blanco puro
██ #F8FAFC  50  - Fondos muy sutiles
██ #F1F5F9  100 - Fondos sutiles
██ #E2E8F0  200 - Bordes estándar
██ #CBD5E1  300 - Bordes medios
██ #94A3B8  400 - Bordes fuertes
██ #64748B  500 - Texto terciario
██ #475569  600 - Texto secundario
██ #334155  700 - Texto secundario oscuro
██ #1F2937  800 - Fondos oscuros
██ #0B1220  900 - Negro corporativo
```

### Semantic Colors

#### Success (Verde)
```
✓ Background: #ECFDF5
✓ Foreground: #065F46
✓ Border:     #A7F3D0
✓ Icon:       #10B981
```

#### Warning (Amarillo)
```
⚠ Background: #FFFBEB
⚠ Foreground: #92400E
⚠ Border:     #FDE68A
⚠ Icon:       #F59E0B
```

#### Danger (Rojo)
```
✕ Background: #FEF2F2
✕ Foreground: #991B1B
✕ Border:     #FECACA
✕ Icon:       #EF4444
```

#### Info (Azul)
```
ℹ Background: #EFF6FF
ℹ Foreground: #1E40AF
ℹ Border:     #BFDBFE
ℹ Icon:       #3B82F6
```

---

## 📏 Spacing Scale

```
0   →  0px   [·]
1   →  4px   [··]
2   →  8px   [····]
3   →  12px  [······]
4   →  16px  [········]  ← Base unit
5   →  20px  [··········]
6   →  24px  [············]
8   →  32px  [················]
10  →  40px  [····················]
12  →  48px  [························]
16  →  64px  [································]
20  →  80px  [········································]
24  →  96px  [················································]
```

**Uso común:**
- Padding interno de componentes: `spacing-4` (16px)
- Gap entre elementos: `spacing-3` (12px)
- Margin entre secciones: `spacing-8` (32px)
- Padding de página: `spacing-6` (24px)

---

## 🔤 Tipografía

### Font Families
```
Display:  Montserrat  → Títulos, headlines, navegación
Body:     Inter        → Cuerpo de texto, botones, UI
Mono:     SF Mono      → Código, SKUs, datos técnicos
```

### Font Weights
```
300  Light      → Raramente usado
400  Regular    → ━━━━ Texto de cuerpo
500  Medium     → ━━━━ Énfasis suave
600  Semibold   → ━━━━ Títulos de cards, labels
700  Bold       → ━━━━ Títulos de sección, precios
800  Extrabold  → ━━━━ Headlines principales
```

### Type Scale
```
6xl   60px/68px   ▓▓▓▓▓▓ Display especial
5xl   48px/56px   ▓▓▓▓▓  Hero headlines
4xl   36px/44px   ▓▓▓▓   Títulos de página
3xl   30px/36px   ▓▓▓    Títulos H2
2xl   24px/32px   ▓▓     Títulos de sección
xl    20px/28px   ▓      Subtítulos
lg    18px/28px   █      Texto destacado
md    16px/24px   █      Texto base (DEFAULT)
sm    14px/20px   ▪      Texto secundario
xs    12px/16px   ·      Labels, badges
2xs   10px/12px   ·      Micro labels
```

### Text Styles Preestablecidos

**Display**
- Font: Montserrat
- Size: 48px (5xl)
- Weight: Bold (700)
- Line Height: Tight (1.15)
- Usage: Hero principal

**H1**
- Font: Montserrat
- Size: 36px (4xl)
- Weight: Bold (700)
- Line Height: Tight (1.15)
- Usage: Título de página

**H2**
- Font: Montserrat
- Size: 30px (3xl)
- Weight: Bold (700)
- Line Height: Snug (1.25)
- Usage: Títulos de sección

**Body**
- Font: Inter
- Size: 16px (md)
- Weight: Regular (400)
- Line Height: Normal (1.5)
- Usage: Texto estándar

**Caption**
- Font: Inter
- Size: 12px (xs)
- Weight: Regular (400)
- Line Height: Snug (1.25)
- Usage: Metadatos, timestamps

---

## 📐 Border Radius

```
none    0px     ▯  Sin redondeo
xs      4px     ▢  Muy sutil
sm      6px     ▢  Sutil
md      10px    ▢  Estándar (inputs, cards pequeñas)
lg      14px    ▢  Cards, paneles
xl      18px    ▢  Modales
2xl     24px    ▢  Elementos grandes
3xl     32px    ▢  Elementos muy grandes
pill    999px   ◯  Completamente redondeado (botones)
circle  50%     ⚪ Círculo perfecto (avatares)
```

---

## 🌑 Shadows

```
none    Sin sombra

xs      ▁  Bordes sutiles elevados
        0 1px 2px rgba(11, 18, 32, 0.04)

sm      ▂  Cards, botones elevados
        0 1px 3px rgba(11, 18, 32, 0.08)

md      ▃  Dropdowns, popovers, hover de cards
        0 4px 6px rgba(11, 18, 32, 0.08)

lg      ▅  Modales, drawers
        0 10px 15px rgba(11, 18, 32, 0.08)

xl      ▆  Overlays grandes
        0 20px 25px rgba(11, 18, 32, 0.1)

2xl     ▇  Máxima elevación
        0 25px 50px rgba(11, 18, 32, 0.15)

inner   ▔  Inputs, campos hundidos
        inset 0 2px 4px rgba(11, 18, 32, 0.06)
```

---

## 📱 Breakpoints

```
        360px          480px        768px           1024px         1280px         1440px
         ↓              ↓            ↓               ↓              ↓              ↓
    ════╪══════════════╪════════════╪═══════════════╪══════════════╪══════════════╪════
        xs             sm           md              lg             xl             2xl
    
    📱 Mobile      📱 Mobile    📱 Tablet       💻 Tablet      💻 Desktop     💻 Large
       Portrait       Landscape    Portrait        Landscape                    Desktop
    
    Container:      Container:    Container:      Container:     Container:     Container:
    360px           480px         720px           960px          1200px         1320px
```

**Estrategia Mobile-First:**
```css
/* Mobile (default) */
.element { width: 100%; }

/* Tablet y superior */
@media (min-width: 768px) {
  .element { width: 50%; }
}

/* Desktop y superior */
@media (min-width: 1024px) {
  .element { width: 33.333%; }
}
```

---

## 🧩 Componentes - Matriz de Variantes

### Button

| Variant      | Background      | Text Color | Border        | Usage                    |
|--------------|-----------------|------------|---------------|--------------------------|
| `primary`    | Red #C9141F     | White      | Transparent   | ★★★ CTAs principales     |
| `secondary`  | Black #0B1220   | White      | Transparent   | ★★ Acciones importantes  |
| `outline`    | Transparent     | Black      | Gray #94A3B8  | ★ Acciones secundarias   |
| `ghost`      | Transparent     | Black      | Transparent   | Acciones terciarias      |
| `destructive`| Red #991B1B     | White      | Transparent   | ⚠ Eliminar, cancelar     |
| `link`       | Transparent     | Blue       | Transparent   | Enlaces inline           |

**Sizes:**
```
xs   [32px]  Botones compactos
sm   [36px]  Botones pequeños
md   [44px]  ← Tamaño estándar
lg   [48px]  CTAs destacados
xl   [56px]  Hero CTAs
```

---

### Input

| State      | Border Color | Background | Icon/Text Color |
|------------|--------------|------------|-----------------|
| `default`  | Gray #E2E8F0 | White      | Black           |
| `hover`    | Gray #CBD5E1 | White      | Black           |
| `focus`    | Blue #2563EB | White      | Black           |
| `error`    | Red #EF4444  | White      | Red #991B1B     |
| `disabled` | Gray #E2E8F0 | Gray #F1F5 | Gray #64748B    |

**Sizes:**
```
sm   [36px]  Formularios compactos
md   [44px]  ← Tamaño estándar
lg   [52px]  Formularios destacados
```

---

### Badge

| Variant   | Background      | Text Color | Usage                    |
|-----------|-----------------|------------|--------------------------|
| `default` | Gray #F1F5F9    | Gray       | General                  |
| `promo`   | Red #C9141F     | White      | ⚡ Ofertas, descuentos   |
| `new`     | Blue #1D4ED8    | White      | 🆕 Productos nuevos      |
| `success` | Green #ECFDF5   | Green      | ✓ Disponible, en stock  |
| `warning` | Yellow #FFFBEB  | Yellow     | ⚠ Últimas unidades      |
| `danger`  | Red #FEF2F2     | Red        | ✕ Agotado               |

---

### Card

| Variant     | Background | Border        | Shadow   | Usage                     |
|-------------|------------|---------------|----------|---------------------------|
| `default`   | White      | Transparent   | None     | Minimalista               |
| `outlined`  | White      | Gray #E2E8F0  | None     | Con separación clara      |
| `elevated`  | White      | Transparent   | sm       | ← Recomendado (e-commerce)|

**Hover state (si clickable):**
- Shadow: `sm` → `md`
- Transform: `translateY(-2px)`

---

## 📐 Layout Patterns

### Grid de Productos

```
Mobile (xs-sm):     Tablet (md-lg):     Desktop (xl-2xl):
┌──────────────┐    ┌──────┬──────┐    ┌────┬────┬────┬────┐
│              │    │      │      │    │    │    │    │    │
│   1 columna  │    │ 2 columnas  │    │   4 columnas    │
│              │    │      │      │    │    │    │    │    │
└──────────────┘    └──────┴──────┘    └────┴────┴────┴────┘
```

### Página con Sidebar (Catálogo)

```
Desktop:
┌─────────────────────────────────────┐
│           Navbar (sticky)           │
├────────┬────────────────────────────┤
│ Filter │                            │
│ Side   │  Product Grid (3-4 cols)  │
│ bar    │                            │
│ (20%)  │        (80%)               │
└────────┴────────────────────────────┘

Mobile:
┌─────────────────┐
│     Navbar      │
├─────────────────┤
│ [🔍 Filters]    │  ← Abre drawer
├─────────────────┤
│                 │
│  Product Grid   │
│   (1 column)    │
│                 │
└─────────────────┘
```

### Detalle de Producto

```
Desktop:
┌──────────────────┬─────────────────┐
│                  │  Product Info   │
│   Image Gallery  │  ├ Title        │
│   (50%)          │  ├ Rating       │
│                  │  ├ Price        │
│                  │  ├ Description  │
│                  │  └ Add to Cart  │
└──────────────────┴─────────────────┘
│         Tabs (Specs/Reviews)       │
└────────────────────────────────────┘
│       Related Products (Carousel)   │
└────────────────────────────────────┘

Mobile:
┌─────────────────┐
│  Image Gallery  │
├─────────────────┤
│  Product Info   │
├─────────────────┤
│  Sticky CTA     │
└─────────────────┘
```

---

## ⚡ Motion & Animation

### Duration
```
instant   0ms     Sin animación
fast      120ms   Hover, focus, micro-interacciones
normal    200ms   ← Transiciones estándar
moderate  300ms   Animaciones elaboradas
slow      400ms   Animaciones complejas
slower    600ms   Animaciones muy elaboradas
```

### Easing Curves
```
linear      ————————  Constante
easeOut     ————╲     Desacelera al final (hover)
easeIn      ╱————     Acelera al inicio (salida)
easeInOut   ╱——╲     Acelera y desacelera
standard    ╱—╲      Material Design (default)
spring      ~/~~     Rebote sutil
```

### Animaciones Comunes

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
/* Duration: 200ms | Easing: easeOut */
```

**Slide Up**
```css
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Duration: 300ms | Easing: emphasized */
```

**Scale In**
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
/* Duration: 120ms | Easing: spring */
```

---

## 🎯 Iconografía

**Librería:** Lucide React  
**Estilo:** Outlined  
**Stroke Width:** 2px

### Tamaños de Iconos

```
2xs   12px  ▪  Iconos muy pequeños inline
xs    16px  •  Iconos inline en texto
sm    20px  ●  Iconos en botones pequeños
md    24px  ◉  ← Iconos estándar
lg    32px  ⦿  Iconos destacados
xl    40px  ⬤  Iconos grandes en hero
2xl   48px  ⬤  Iconos decorativos
```

### Categorías Principales

**Navigation**
```
☰  Menu
✕  X (close)
⌄  ChevronDown
›  ChevronRight
←  ArrowLeft
→  ArrowRight
```

**E-commerce**
```
🛒 ShoppingCart
❤  Heart
🔍 Search
⚙  Filter
📦 Package
🚚 Truck
💳 CreditCard
```

**Status**
```
✓  CheckCircle     (success)
⚠  AlertTriangle   (warning)
✕  XCircle         (error)
ℹ  Info            (info)
```

**Actions**
```
+  Plus
-  Minus
🗑  Trash2
✎  Edit2
💾 Save
📋 Copy
```

---

## ♿ Accesibilidad

### Contraste Mínimo (WCAG 2.1 AA)

```
Texto Normal:         4.5:1  ✓
Texto Grande (18px+): 3.0:1  ✓
Elementos UI:         3.0:1  ✓
```

### Área de Toque

```
Mínimo:      44px × 44px  ✓
Preferido:   48px × 48px  ✓
```

**Ejemplos:**
- Botones: 44px altura mínima ✓
- Iconos clickeables: 44px × 44px ✓
- Checkboxes: 20px + padding 12px = 44px ✓

### Focus Visible

```css
:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
}
```

**Debe ser visible en:**
- Botones ✓
- Links ✓
- Inputs ✓
- Checkboxes/Radios ✓
- Elementos de navegación ✓

### Navegación por Teclado

**Teclas soportadas:**
- `Tab` / `Shift+Tab` → Navegar entre elementos
- `Enter` / `Space` → Activar botones
- `Escape` → Cerrar modales/drawers
- `Arrow Keys` → Navegar tabs, dropdowns

### Soporte para Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📊 Jerarquía Visual

### Niveles de Énfasis

```
Nivel 1 (Más alto):
  • CTAs principales (Button primary)
  • Precios destacados
  • Badges de oferta
  Color: Red #C9141F
  Weight: Bold
  Size: Large

Nivel 2 (Alto):
  • Títulos de sección
  • Botones secundarios
  • Información importante
  Color: Black #0B1220
  Weight: Semibold/Bold
  Size: Medium-Large

Nivel 3 (Medio):
  • Títulos de producto
  • Texto de cuerpo
  • Labels
  Color: Black #0B1220
  Weight: Medium/Regular
  Size: Medium

Nivel 4 (Bajo):
  • Texto secundario
  • Metadatos
  • Helper text
  Color: Gray #334155
  Weight: Regular
  Size: Small

Nivel 5 (Más bajo):
  • Placeholders
  • Timestamps
  • Texto disabled
  Color: Gray #64748B
  Weight: Regular
  Size: Small
```

---

## 🛒 Patrones E-commerce Específicos

### ProductCard States

```
Default:
┌────────────────┐
│    [Image]     │
│ ₊₊₊₊₊₊₊₊₊₊₊₊  │ ← Rating
│ Producto Name  │
│ $59.99         │
│ [Add to Cart]  │
└────────────────┘

Hover:
┌────────────────┐
│    [Image]     │ ← Shadow elevada
│  ❤ 👁         │ ← Actions aparecen
│ ₊₊₊₊₊₊₊₊₊₊₊₊  │
│ Producto Name  │
│ $59.99         │
│ [Add to Cart]  │
└────────────────┘  ← Transform Y(-2px)

Out of Stock:
┌────────────────┐
│    [Image]     │
│   🚫 AGOTADO   │ ← Overlay
│ ₊₊₊₊₊₊₊₊₊₊₊₊  │ ← Opacidad 0.6
│ Producto Name  │
│ $59.99         │
└────────────────┘
```

### Cart Drawer

```
┌──────────────────────┐
│ Carrito (3) ₓ       │
├──────────────────────┤
│ [img] Producto 1     │
│       $59.99  [-][+]│
├──────────────────────┤
│ [img] Producto 2     │
│       $29.99  [-][+]│
├──────────────────────┤
│ [img] Producto 3     │
│       $89.99  [-][+]│
├──────────────────────┤
│ Subtotal:    $179.97│
│ Envío:         $0.00│
│ ─────────────────────│
│ Total:       $179.97│
├──────────────────────┤
│ [Finalizar compra]  │
└──────────────────────┘
```

---

## 🎨 Tokens CSS Variables

```css
:root {
  /* Colors */
  --sj-color-brand-primary-600: #C9141F;
  --sj-color-brand-secondary-600: #1D4ED8;
  --sj-color-neutral-0: #FFFFFF;
  --sj-color-neutral-900: #0B1220;
  
  /* Spacing */
  --sj-spacing-1: 4px;
  --sj-spacing-2: 8px;
  --sj-spacing-4: 16px;
  --sj-spacing-6: 24px;
  
  /* Typography */
  --sj-font-display: 'Montserrat', sans-serif;
  --sj-font-body: 'Inter', sans-serif;
  --sj-font-size-md: 16px;
  --sj-font-weight-semibold: 600;
  
  /* Radius */
  --sj-radius-md: 10px;
  --sj-radius-lg: 14px;
  --sj-radius-pill: 999px;
  
  /* Shadow */
  --sj-shadow-sm: 0 1px 3px rgba(11, 18, 32, 0.08);
  --sj-shadow-md: 0 4px 6px rgba(11, 18, 32, 0.08);
  
  /* Motion */
  --sj-duration-fast: 120ms;
  --sj-duration-normal: 200ms;
  --sj-easing-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

---

## 📝 Checklist de Implementación

### ✓ Componente Completo
- [ ] Props definidos con tipos
- [ ] Variantes implementadas
- [ ] Todos los tamaños funcionan
- [ ] Estados (hover, active, focus, disabled) implementados
- [ ] Responsive en todos los breakpoints
- [ ] Accesibilidad (ARIA, keyboard nav)
- [ ] Animaciones con reduced motion
- [ ] Documentación y ejemplos

### ✓ Página Completa
- [ ] Template seguido correctamente
- [ ] Componentes correctos usados
- [ ] Tokens aplicados consistentemente
- [ ] Responsive mobile → desktop
- [ ] SEO (meta tags, structured data)
- [ ] Performance (lazy load, code split)
- [ ] Analytics events
- [ ] Accesibilidad validada

---

**Versión:** 2.0.0  
**Última actualización:** 2026-02-06  
**Referencia:** `design-system.json`
