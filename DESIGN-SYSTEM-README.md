# Sistema de Diseño SJ Electronics

Sistema de diseño funcional completo de alto nivel para la plataforma e-commerce de SJ Electronics.

## 📋 Contenido

- **34 Componentes UI** completamente especificados
- **12 Categorías de tokens** (color, tipografía, espaciado, etc.)
- **6 Templates de página** (Home, Catálogo, Detalle, Carrito, Checkout, Cuenta)
- **Patrones de interacción** y comportamientos
- **Especificaciones de accesibilidad** (WCAG 2.1 AA)
- **Integración con APIs** y formatos de datos

## 🎨 Tokens Principales

### Color
- **Brand Primary**: Rojo corporativo (#C9141F) - CTAs, elementos de marca
- **Brand Secondary**: Azul (#1D4ED8) - Links, elementos secundarios
- **Neutrales**: Escala completa de grises para texto y fondos
- **Estados semánticos**: Success, Warning, Danger, Info

### Tipografía
- **Display**: Montserrat (títulos, headlines)
- **Body**: Inter (cuerpo de texto, UI)
- **Mono**: SF Mono/Roboto Mono (código, SKUs)

### Espaciado
Sistema de 8px base con escala de 0 a 128px

### Breakpoints
- `xs`: 360px (Mobile Portrait)
- `sm`: 480px (Mobile Landscape)
- `md`: 768px (Tablet Portrait)
- `lg`: 1024px (Tablet Landscape/Desktop)
- `xl`: 1280px (Desktop)
- `2xl`: 1440px (Large Desktop)

## 🧩 Componentes Principales

### Formularios
- `Button`: 6 variantes, 5 tamaños, estados completos
- `Input`: Validación, iconos, estados de error
- `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`

### Navegación
- `Navbar`: Sticky, responsive, con búsqueda
- `Breadcrumb`: Navegación jerárquica
- `Tabs`: 3 variantes (line, enclosed, pills)
- `Pagination`: Control de páginas

### Feedback
- `Toast`: Notificaciones temporales
- `Alert`: Mensajes persistentes
- `Modal`: Diálogos bloqueantes
- `Drawer`: Paneles laterales
- `Tooltip`: Información contextual

### E-commerce Específicos
- `ProductCard`: Tarjeta de producto con imagen, precio, rating, CTA
- `CartDrawer`: Drawer lateral con carrito de compras
- `SearchBar`: Búsqueda con autocompletado
- `FilterGroup`: Filtros para catálogos
- `ImageGallery`: Galería con thumbnails y zoom
- `Carousel`: Carrusel de contenido

### Contenedores
- `Card`: Contenedor elevado con variantes
- `Accordion`: Secciones colapsables
- `Divider`: Separadores visuales

### Indicadores
- `Badge`: Etiquetas pequeñas
- `Avatar`: Imágenes de perfil
- `Spinner`: Indicador de carga
- `Skeleton`: Placeholder animado
- `Progress`: Barra de progreso

### Layouts
- `Hero`: Sección principal
- `Footer`: Pie de página
- `PromoStrip`: Barra de promociones

## 📄 Templates de Página

### Home
```
PromoStrip → Navbar → Hero → CategoryGrid → 
DealsCarousel → ProductsGrid → Newsletter → Footer
```

### Catalog
```
PromoStrip → Navbar → Breadcrumb → FiltersSidebar + 
ProductGrid → Pagination → Footer
```

### ProductDetail
```
PromoStrip → Navbar → Breadcrumb → Gallery + ProductInfo →
SpecsTabs → RelatedProducts → Footer
```

### Cart
```
Navbar → Breadcrumb → CartItems + OrderSummary → 
Recommendations → Footer
```

### Checkout
```
NavbarMinimal → CheckoutSteps → ShippingForm + 
PaymentForm + OrderSummarySticky → FooterMinimal
```

### Account
```
Navbar → AccountSidebar + DynamicContent → Footer
```

## 🎯 Uso del Sistema

### 1. Implementación de Tokens

```javascript
// Ejemplo: CSS Variables
:root {
  --sj-color-brand-primary-600: #C9141F;
  --sj-color-brand-secondary-600: #1D4ED8;
  --sj-spacing-4: 16px;
  --sj-radius-lg: 14px;
  --sj-shadow-md: 0 4px 6px rgba(11, 18, 32, 0.08);
}
```

### 2. Componentes

Cada componente en `design-system.json` incluye:

- **Props**: Propiedades con tipos, valores por defecto y descripciones
- **Variants**: Variaciones visuales (primary, secondary, etc.)
- **Sizes**: Tamaños predefinidos (xs, sm, md, lg, xl)
- **States**: Estados interactivos (hover, active, disabled, loading)
- **Styling**: Especificaciones de estilo (colores, spacing, radius, etc.)
- **Behavior**: Comportamientos funcionales (eventos, animaciones)
- **A11y**: Requerimientos de accesibilidad

Ejemplo de uso de Button:

```jsx
<Button
  variant="primary"
  size="lg"
  icon={<ShoppingCart />}
  onClick={handleAddToCart}
>
  Agregar al carrito
</Button>
```

### 3. Responsive Design

Todos los componentes y layouts incluyen especificaciones responsive:

```javascript
// Ejemplo de ProductCard columns
{
  mobile: 1,   // 1 columna en mobile
  tablet: 2,   // 2 columnas en tablet
  desktop: 4   // 4 columnas en desktop
}
```

## ♿ Accesibilidad

- **WCAG 2.1 AA compliance**
- Contraste mínimo: 4.5:1 (texto normal), 3.0:1 (texto grande)
- Tamaño mínimo de área táctil: 44px
- Focus visible en todos los elementos interactivos
- Navegación por teclado completa
- ARIA labels y roles apropiados
- Soporte para `prefers-reduced-motion`

## 🎨 Paleta de Colores

### Brand Primary (Rojo)
- `50`: #FFF1F1 - Fondos muy sutiles
- `100`: #FFE0E0 - Fondos sutiles
- `600`: #C9141F - **CTAs principales**
- `700`: #A80F18 - Hover states
- `900`: #5C050A - Texto oscuro

### Brand Secondary (Azul)
- `100`: #DBEAFE - Elementos seleccionados
- `500`: #2563EB - Focus rings
- `600`: #1D4ED8 - **Links**
- `700`: #1E40AF - Links hover

### Semantic
- **Success**: Verde (#10B981)
- **Warning**: Amarillo (#F59E0B)
- **Danger**: Rojo (#EF4444)
- **Info**: Azul (#3B82F6)

## 🔄 Estados de Componentes

Todos los componentes interactivos incluyen:

1. **Default**: Estado inicial
2. **Hover**: Mouse sobre elemento
3. **Active/Pressed**: Click/tap activo
4. **Focus**: Elemento con foco de teclado
5. **Disabled**: Elemento deshabilitado
6. **Loading**: Cargando (cuando aplica)
7. **Error**: Estado de error (formularios)
8. **Success**: Estado de éxito (formularios)

## 📱 Iconografía

- **Librería**: Lucide React
- **Estilo**: Outlined
- **Stroke width**: 2px
- **Tamaños**: xs (16px), sm (20px), md (24px), lg (32px), xl (40px)

Categorías:
- **Navigation**: Menu, ChevronDown, ArrowLeft, etc.
- **Actions**: Plus, Trash2, Edit2, Save, etc.
- **E-commerce**: ShoppingCart, Heart, Search, Package, etc.
- **Status**: CheckCircle, AlertCircle, Info, etc.
- **Social**: Facebook, Instagram, Twitter, etc.

## 🚀 Performance

### Imágenes
- Lazy loading habilitado
- Formatos: WebP + JPG fallback
- Tamaños: 80, 320, 640, 1024, 1920px
- Calidad: 85%

### Caching
- Estrategia: stale-while-revalidate
- TTL: Productos (5min), Categorías (10min), Estáticos (1h)

### Bundling
- Code splitting por rutas
- Lazy load de modales y componentes pesados

## 📊 Formatos de Datos

### Product
```typescript
{
  id: string;
  sku: string;
  name: string;
  price: number; // en centavos
  images: string[];
  inStock: boolean;
  rating: number; // 0-5
  // ... más campos
}
```

### Order
```typescript
{
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number; // en centavos
  // ... más campos
}
```

## 🔗 Integración API

Endpoints principales:
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalle de producto
- `POST /api/cart/items` - Agregar al carrito
- `POST /api/checkout` - Iniciar checkout

## 📈 Analytics

Eventos rastreados:
- Page View
- Product View
- Add to Cart
- Remove from Cart
- Checkout
- Purchase
- Search

## 🔒 SEO

- Títulos dinámicos con template
- Meta descriptions personalizadas
- Open Graph tags
- Structured Data (Organization, Product, Breadcrumb)
- Sitemap XML

## 📝 Convenciones de Código

- **Componentes**: PascalCase (`Button`, `ProductCard`)
- **Props**: camelCase (`onClick`, `showIcon`)
- **Tokens**: kebab-case (`spacing-4`, `color-brand-primary`)
- **CSS Variables**: `--sj-{category}-{name}`
- **Data Attributes**: `data-sj-{name}`

## 🎓 Ejemplos de Uso

### Crear un ProductCard

```jsx
import { ProductCard } from '@/components/ProductCard';

<ProductCard
  product={{
    id: '123',
    name: 'Bocina Bluetooth RGB',
    image: '/products/bocina.jpg',
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    badge: 'OFERTA'
  }}
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleAddToWishlist}
/>
```

### Mostrar Toast de Confirmación

```jsx
import { toast } from '@/components/Toast';

toast.success({
  title: 'Producto agregado',
  description: 'Se agregó el producto al carrito',
  duration: 3000
});
```

### Abrir Modal

```jsx
import { Modal } from '@/components/Modal';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Detalles del producto"
  size="lg"
>
  {/* Contenido */}
</Modal>
```

## 📞 Soporte

Para preguntas sobre el sistema de diseño, contactar al equipo de diseño de SJ Electronics.

---

**Versión**: 2.0.0  
**Última actualización**: 2026-02-06  
**Archivo fuente**: `design-system.json`
