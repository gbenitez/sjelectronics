# SJ Electronics - Sistema de Diseño

Sistema de diseño completo para e-commerce de electrónica, construido con Vue 3, Vite y Tailwind CSS.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📦 Estructura del Proyecto

```
sj/
├── src/
│   ├── components/        # Componentes del sistema de diseño
│   │   ├── SJButton.vue
│   │   ├── SJBadge.vue
│   │   ├── SJInput.vue
│   │   ├── SJCard.vue
│   │   ├── SJToast.vue
│   │   ├── SJBreadcrumb.vue
│   │   ├── SJTabs.vue
│   │   ├── SJModal.vue
│   │   └── SJProductCard.vue
│   ├── App.vue            # Página principal con showcase
│   ├── main.js
│   └── style.css
├── design.json            # Tokens y especificaciones del sistema
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🎨 Componentes Disponibles

### Botones (SJButton)
Variantes: `primary`, `secondary`, `outline`, `ghost`, `destructive`  
Tamaños: `sm`, `md`, `lg`

```vue
<SJButton variant="primary" size="md">
  Agregar al carrito
</SJButton>
```

### Badges (SJBadge)
Variantes: `promo`, `new`, `neutral`

```vue
<SJBadge variant="promo">-20%</SJBadge>
```

### Inputs (SJInput)
Soporte para labels, mensajes de error, helper text y estado disabled.

```vue
<SJInput
  v-model="email"
  label="Email"
  placeholder="ejemplo@email.com"
  error="Email inválido"
/>
```

### Cards (SJCard)
Tarjetas con shadow normal o elevado.

```vue
<SJCard elevated>
  <h3>Título de la tarjeta</h3>
  <p>Contenido...</p>
</SJCard>
```

### Toast / Alertas (SJToast)
Variantes: `success`, `danger`, `info`

```vue
<SJToast
  variant="success"
  title="¡Éxito!"
  message="Operación completada"
/>
```

### Breadcrumb (SJBreadcrumb)
Navegación de ruta.

```vue
<SJBreadcrumb :items="breadcrumbItems" />
```

### Tabs (SJTabs)
Sistema de pestañas con modelo reactivo.

```vue
<SJTabs v-model="activeTab" :tabs="tabItems">
  <div>Contenido del tab</div>
</SJTabs>
```

### Modal (SJModal)
Modal con overlay, slots para título, contenido y footer.

```vue
<SJModal v-model="showModal" title="Mi Modal">
  <p>Contenido del modal</p>
  <template #footer>
    <SJButton @click="showModal = false">Cerrar</SJButton>
  </template>
</SJModal>
```

### Product Card (SJProductCard)
Tarjeta de producto para e-commerce con imagen, precio, badges y acciones.

```vue
<SJProductCard
  :product="product"
  @add-to-cart="handleAddToCart"
  @view-details="handleViewDetails"
/>
```

## 🎨 Tokens de Diseño

### Colores

#### Brand Primary (Rojo)
- `brand-primary-50` hasta `brand-primary-900`
- Color principal: `#C9141F` (600)

#### Brand Secondary (Azul)
- `brand-secondary-50` hasta `brand-secondary-900`
- Color secundario: `#1D4ED8` (600)

#### Neutral
- `neutral-0` hasta `neutral-900`
- Escalas de grises del sistema

### Tipografía

- **Display**: Montserrat (para títulos y encabezados)
- **Body**: Inter (para contenido y textos)
- **Mono**: Monospace (para código)

Tamaños: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`

### Border Radius

- `rounded-sm`: 6px
- `rounded-md`: 10px
- `rounded-lg`: 14px
- `rounded-xl`: 18px
- `rounded-pill`: 999px

### Shadows

- `shadow-sm`: Sombra sutil
- `shadow-md`: Sombra media
- `shadow-lg`: Sombra prominente

## 🔧 Configuración de Tailwind

El proyecto incluye una configuración personalizada de Tailwind CSS que extiende el tema por defecto con los tokens del sistema de diseño:

- Colores personalizados (brand, neutral)
- Fuentes tipográficas
- Sombras personalizadas
- Border radius personalizados

## 📱 Responsive Design

Todos los componentes están diseñados con enfoque mobile-first y son completamente responsive.

Breakpoints:
- `xs`: 360px
- `sm`: 480px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1440px

## ♿ Accesibilidad

El sistema cumple con estándares WCAG 2.1 AA:
- Contraste de colores adecuado
- Focus rings visibles
- Tamaño mínimo de tap target: 44px
- Soporte para screen readers

## 📄 Licencia

© 2026 SJ Electronics. Todos los derechos reservados.
