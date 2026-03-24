<template>
  <div class="bg-neutral-50 dark:bg-neutral-950">
    <SJHeroSlideshow
      eyebrow="Sistema de diseño"
      title="Componentes"
      subtitle="Showcase del sistema de diseño y componentes reutilizables."
      :backgrounds="heroBackgrounds"
      :interval-ms="3600"
    >
      <template #ctas>
        <button type="button" class="btn btn-primary" @click="scrollToId('tokens')">Ver tokens</button>
        <button type="button" class="btn btn-outline border-white/30 text-white hover:bg-white/10 active:bg-white/15" @click="scrollToId('components')">
          Ver componentes
        </button>
        <button type="button" class="btn btn-outline border-white/30 text-white hover:bg-white/10 active:bg-white/15" @click="scrollToId('products')">
          Product cards
        </button>
      </template>
    </SJHeroSlideshow>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">

    <!-- Tokens Section -->
    <section id="tokens" class="mb-20">
      <h2 class="text-3xl sm:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-2">Tokens de Diseño</h2>
      <p class="text-base sm:text-lg text-neutral-600 dark:text-white/65 mb-8">Tokens fundamentales del sistema de diseño</p>

      <!-- Colores -->
      <div class="mb-12">
        <h3 class="text-2xl font-display font-semibold text-neutral-900 dark:text-white mb-6">Colores</h3>

        <div class="mb-8">
          <h4 class="text-lg font-semibold text-neutral-700 dark:text-white/80 mb-4">Brand Primary (Rojo)</h4>
          <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" class="space-y-1">
              <div :class="`bg-brand-primary-${shade} h-16 rounded-lg border border-neutral-200 dark:border-white/10`" :title="`primary-${shade}`"></div>
              <p class="text-xs text-center text-neutral-600 dark:text-white/60">{{ shade }}</p>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h4 class="text-lg font-semibold text-neutral-700 dark:text-white/80 mb-4">Brand Secondary (Azul)</h4>
          <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
            <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" class="space-y-1">
              <div :class="`bg-brand-secondary-${shade} h-16 rounded-lg border border-neutral-200 dark:border-white/10`" :title="`secondary-${shade}`"></div>
              <p class="text-xs text-center text-neutral-600 dark:text-white/60">{{ shade }}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-neutral-700 dark:text-white/80 mb-4">Neutral</h4>
          <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-11 gap-2">
            <div v-for="shade in [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" class="space-y-1">
              <div :class="`bg-neutral-${shade} h-16 rounded-lg border border-neutral-200 dark:border-white/10`" :title="`neutral-${shade}`"></div>
              <p class="text-xs text-center text-neutral-600 dark:text-white/60">{{ shade }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tipografía -->
      <div class="mb-12">
        <h3 class="text-2xl font-display font-semibold text-neutral-900 dark:text-white mb-6">Tipografía</h3>
        <div class="space-y-6">
          <div>
            <p class="text-sm text-neutral-600 dark:text-white/60 mb-2">Display (Montserrat) - Para títulos</p>
            <p class="font-display text-4xl font-bold text-neutral-900 dark:text-white">The quick brown fox jumps</p>
          </div>
          <div>
            <p class="text-sm text-neutral-600 dark:text-white/60 mb-2">Body (Montserrat) - Para contenido (catálogo)</p>
            <p class="font-body text-lg text-neutral-900 dark:text-white">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p class="text-sm text-neutral-600 dark:text-white/60 mb-2">Sección en mayúsculas (poster tracking)</p>
            <p class="font-display text-3xl font-bold uppercase tracking-poster text-brand-primary-600 dark:text-brand-primary-300">NEVERAS</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Components Section -->
    <section id="components" class="mb-20">
      <h2 class="text-3xl sm:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-2">Componentes</h2>
      <p class="text-base sm:text-lg text-neutral-600 dark:text-white/65 mb-8">Componentes reutilizables del sistema</p>

      <div class="mb-12">
        <h3 class="text-2xl font-display font-semibold text-neutral-900 dark:text-white mb-6">Buttons</h3>
        <div class="flex flex-wrap gap-4">
          <SJButton variant="primary">Primary</SJButton>
          <SJButton variant="secondary">Secondary</SJButton>
          <SJButton variant="outline">Outline</SJButton>
          <SJButton variant="ghost">Ghost</SJButton>
          <SJButton variant="destructive">Destructive</SJButton>
        </div>
      </div>

      <div class="mb-12">
        <h3 class="text-2xl font-display font-semibold text-neutral-900 dark:text-white mb-6">Formularios</h3>
        <div class="grid lg:grid-cols-2 gap-8 max-w-5xl items-start">
          <SJCard elevated padding="10">
            <h4 class="text-lg font-semibold mb-4">Formulario (demo)</h4>
            <div class="grid gap-7">
              <div class="grid md:grid-cols-2 gap-6">
                <SJInput id="form-name" v-model="formName" label="Nombre" placeholder="Tu nombre" />
                <SJInput id="form-email" v-model="formEmail" label="Email" placeholder="tu@email.com" />
              </div>
              <SJSelect id="form-category" v-model="formCategory" label="Categoría" :options="categoryOptions" />
              <div class="grid md:grid-cols-2 gap-4">
                <SJSwitch v-model="formNotify">Notificaciones</SJSwitch>
                <SJCheckbox v-model="formAccepted">Acepto términos</SJCheckbox>
              </div>
              <div class="flex flex-wrap gap-4 pt-1">
                <SJButton>Enviar</SJButton>
                <SJButton variant="outline">Cancelar</SJButton>
              </div>
            </div>
          </SJCard>

          <SJCard elevated padding="10">
            <h4 class="text-lg font-semibold mb-4">Valores</h4>
            <div class="space-y-2 text-sm text-neutral-700 dark:text-white/75">
              <p><span class="font-semibold">Nombre:</span> {{ formName || '—' }}</p>
              <p><span class="font-semibold">Email:</span> {{ formEmail || '—' }}</p>
              <p><span class="font-semibold">Categoría:</span> {{ formCategory }}</p>
              <p><span class="font-semibold">Notificaciones:</span> {{ formNotify ? 'Sí' : 'No' }}</p>
              <p><span class="font-semibold">Términos:</span> {{ formAccepted ? 'Aceptados' : 'No aceptados' }}</p>
            </div>
          </SJCard>
        </div>
      </div>

      <div class="mb-12">
        <h3 class="text-2xl font-display font-semibold text-neutral-900 dark:text-white mb-6">Tabla</h3>
        <SJTable title="Inventario (demo)" :subtitle="`${tableRows.length} filas`" :columns="tableColumns" :rows="tableRows" />
      </div>
    </section>

    <section id="products" class="mb-20">
      <h2 class="text-3xl sm:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-2">Product Cards</h2>
      <p class="text-base sm:text-lg text-neutral-600 dark:text-white/65 mb-8">Tarjetas de producto para e-commerce</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SJProductCard v-for="product in sampleProducts" :key="product.id" :product="product" @add-to-cart="noop" @view-details="noop" />
      </div>
    </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'
import SJButton from '../components/SJButton.vue'
import SJInput from '../components/SJInput.vue'
import SJCard from '../components/SJCard.vue'
import SJSelect from '../components/SJSelect.vue'
import SJCheckbox from '../components/SJCheckbox.vue'
import SJSwitch from '../components/SJSwitch.vue'
import SJTable from '../components/SJTable.vue'
import SJProductCard from '../components/SJProductCard.vue'

const srcFor = (filename) => `/${encodeURI(String(filename))}`

const heroBackgrounds = computed(() => [
  srcFor('banner 2026-02-07 at 15.11.01.png'),
  srcFor('banner 2026-02-07 at 15.15.32.png'),
  srcFor('banner 2026-02-07 at 15.16.21.png'),
  srcFor('banner 2026-02-07 at 15.10.29.png')
])

const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const noop = () => {}

const formName = ref('')
const formEmail = ref('')
const formCategory = ref('all')
const formNotify = ref(true)
const formAccepted = ref(false)

const categoryOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'audio', label: 'Audio y Sonido' },
  { value: 'refrigeracion', label: 'Refrigeración' },
  { value: 'electrodomesticos', label: 'Electrodomésticos' },
  { value: 'cocina', label: 'Cocina' },
  { value: 'lavanderia', label: 'Lavandería' }
]

const tableColumns = [
  { key: 'sku', header: 'SKU' },
  { key: 'name', header: 'Producto' },
  { key: 'price', header: 'Precio' },
  { key: 'discount', header: 'Desc.' },
  { key: 'stock', header: 'Stock' }
]

const tableRows = ref([
  { id: 1, sku: 'SJ-200SD', name: 'Nevera Modelo SJ-200SD (200 Lts)', price: 299.99, discount: 0, stock: 12 },
  { id: 2, sku: 'AC-18K-IN', name: 'Aire Split 18000 BTU Inverter', price: 549.0, discount: 21, stock: 8 },
  { id: 3, sku: 'BOC-RGB-01', name: 'Bocina Bluetooth RGB', price: 59.99, discount: 25, stock: 45 }
])

const sampleProducts = ref([
  { id: 1, name: 'Nevera (demo)', currentPrice: 299.99, originalPrice: null, discount: null, isNew: true, image: null },
  { id: 2, name: 'Aire Split (demo)', currentPrice: 549.0, originalPrice: 699.0, discount: 21, isNew: false, image: null },
  { id: 3, name: 'Lavadora (demo)', currentPrice: 699.0, originalPrice: 849.0, discount: 18, isNew: false, image: null },
  { id: 4, name: 'Bocina (demo)', currentPrice: 59.99, originalPrice: 79.99, discount: 25, isNew: true, image: null }
])
</script>

