<template>
  <div class="bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white">
    <!-- CONTENIDO (sin HERO) -->
    <section class="bg-neutral-100 dark:bg-neutral-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-10 sm:pb-16">
        <header class="mb-10 sm:mb-12">
          <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400">
            Catálogo
          </p>
          <h1 class="mt-3 font-display font-bold text-4xl sm:text-5xl text-neutral-900 dark:text-white leading-tight">
            Productos
          </h1>
          <p class="mt-4 text-lg sm:text-xl text-neutral-600 dark:text-white/70 max-w-3xl">
            Explora categorías y encuentra tu próximo electrodoméstico.
          </p>
        </header>

        <!-- Categorías -->
        <div class="mb-10 sm:mb-12">
          <div class="flex items-center justify-start sm:justify-center gap-2 mb-6 overflow-x-auto pb-2">
            <button
              type="button"
              class="text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-none border border-neutral-900/10 hover:border-neutral-900/20 dark:border-white/15 dark:hover:border-white/30 transition"
              :class="selectedCategory === 'all' ? 'bg-neutral-900/5 dark:bg-white/10' : 'bg-transparent'"
              @click="setCategory('all')"
            >
              Todos
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 md:gap-6 max-w-6xl mx-auto">
            <button
              v-for="c in categories"
              :key="c.id"
              type="button"
              class="group flex items-center gap-3 text-left rounded-none px-3 py-2 hover:bg-neutral-900/5 dark:hover:bg-white/5 transition"
              :class="selectedCategory === c.id ? 'bg-neutral-900/5 ring-1 ring-neutral-900/10 dark:bg-white/7 dark:ring-white/15' : 'bg-transparent'"
              @click="setCategory(c.id)"
            >
              <div class="h-10 w-10 rounded-md bg-neutral-900/5 dark:bg-white/5 border border-neutral-900/10 dark:border-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5 text-neutral-900/80 dark:text-white/80">
                  <path :d="c.icon" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-semibold uppercase tracking-wide text-neutral-900/90 dark:text-white/90 truncate">
                  {{ c.label }}
                </div>
                <div class="text-xs text-neutral-600 dark:text-white/55">
                  {{ countByCategory[c.id] ?? 0 }} Products
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="grid lg:grid-cols-12 gap-8 items-start">
          <!-- Sidebar -->
          <aside class="hidden lg:block lg:col-span-3">
            <div class="sticky top-24">
              <h3 class="text-xs font-semibold uppercase tracking-wide text-neutral-900/80 dark:text-white/85 mb-4">
                Combina tus productos
              </h3>
              <div class="divide-y divide-neutral-900/10 dark:divide-white/10 rounded-lg border border-neutral-900/10 dark:border-white/10 bg-white dark:bg-neutral-950/40">
                <button
                  v-for="p in comboList"
                  :key="p.id"
                  type="button"
                  class="w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-900/3 dark:hover:bg-white/5 transition"
                  @click="setCategory(p.category)"
                >
                  <div class="h-10 w-10 rounded-md bg-white border border-neutral-900/10 dark:border-white/10 overflow-hidden">
                    <img
                      v-if="imgSrc(p.image)"
                      :src="imgSrc(p.image)"
                      :alt="p.name"
                      width="430"
                      height="271"
                      class="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div v-else class="h-full w-full bg-neutral-100"></div>
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-neutral-900 dark:text-white/90 line-clamp-2">
                      {{ p.name }}
                    </div>
                    <div class="text-xs text-neutral-600 dark:text-white/55 mt-0.5">
                      {{ categoryLabel(p.category) }}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main -->
          <div class="lg:col-span-9">
            <!-- breadcrumb + controls -->
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div class="text-sm text-neutral-600 dark:text-white/60">
                Home <span class="text-neutral-400 dark:text-white/30 px-1">/</span>
                <a class="font-semibold hover:text-neutral-900 dark:hover:text-white transition" href="#/productos">Productos</a>
                <template v-if="selectedCategory !== 'all'">
                  <span class="text-neutral-400 dark:text-white/30 px-1">/</span>
                  <span class="text-neutral-900 dark:text-white/85 font-semibold">{{ categoryLabel(selectedCategory) }}</span>
                </template>
              </div>

              <div class="flex flex-wrap items-center gap-4">
                <div class="text-sm text-neutral-700 dark:text-white/70">
                  <span class="font-semibold text-neutral-900 dark:text-white/85">Show:</span>
                  <button
                    v-for="n in showOptions"
                    :key="n"
                    type="button"
                    class="ml-2 hover:text-neutral-900 dark:hover:text-white transition"
                    :class="perPage === n ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-4' : 'text-neutral-700 dark:text-white/70'"
                    @click="perPage = n"
                  >
                    {{ n }}
                  </button>
                </div>

                <div class="hidden sm:flex items-center gap-2 text-neutral-700 dark:text-white/70">
                  <button type="button" class="p-2 rounded-none border border-neutral-900/10 dark:border-white/10 hover:bg-neutral-900/5 dark:hover:bg-white/5" @click="view = 'grid'">
                    <span class="sr-only">Grid</span>
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" stroke-width="1.7"/>
                    </svg>
                  </button>
                  <button type="button" class="p-2 rounded-none border border-neutral-900/10 dark:border-white/10 hover:bg-neutral-900/5 dark:hover:bg-white/5" @click="view = 'compact'">
                    <span class="sr-only">Compact</span>
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                      <path d="M5 6h14M5 12h14M5 18h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>

                <div>
                  <label class="sr-only" for="sort">Orden</label>
                  <select
                    id="sort"
                    v-model="sort"
                    class="min-h-[44px] px-3 py-2.5 rounded-md border bg-white dark:bg-neutral-950/40 text-neutral-900 dark:text-white border-neutral-900/10 dark:border-white/10 focus:outline-none focus:ring-3 focus:ring-brand-secondary-500/35 focus:ring-offset-0"
                  >
                    <option value="default">Default sorting</option>
                    <option value="name-asc">Nombre (A–Z)</option>
                    <option value="name-desc">Nombre (Z–A)</option>
                    <option value="category">Categoría</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- grid -->
            <div
              class="grid gap-6"
              :class="view === 'compact' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'"
            >
              <article
                v-for="p in visibleProducts"
                :key="p.id"
                class="relative bg-white dark:bg-neutral-950/35 border border-neutral-900/10 dark:border-white/10 rounded-lg overflow-hidden hover:border-neutral-900/20 dark:hover:border-white/20 transition"
              >
                <a
                  class="absolute inset-0 focus:outline-none focus-visible:ring-3 focus-visible:ring-brand-secondary-500/35 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:focus-visible:ring-offset-neutral-900"
                  :href="productHref(p)"
                  :aria-label="`Ver ${p.name}`"
                >
                  <span class="sr-only">Ver {{ p.name }}</span>
                </a>
                <div class="bg-white aspect-[4/3] flex items-center justify-center">
                  <img
                    v-if="imgSrc(p.image)"
                    :src="imgSrc(p.image)"
                    :alt="p.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <!-- placeholder imagen (mantener diseño) -->
                  <svg v-else viewBox="0 0 24 24" fill="none" class="h-12 w-12 text-neutral-300">
                    <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8 13l2.5-2.5a1 1 0 0 1 1.4 0L16 14.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.5 12.5 16 11a1 1 0 0 1 1.4 0L20 13.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="p-4">
                  <h3 class="text-sm font-semibold text-neutral-900 dark:text-white/90 text-center leading-snug min-h-[40px] line-clamp-2">
                    {{ p.name }}
                  </h3>
                  <p class="text-xs text-neutral-600 dark:text-white/55 text-center mt-2">
                    {{ categoryLabel(p.category) }}
                  </p>
                </div>
              </article>
            </div>

            <div class="mt-8 text-sm text-neutral-600 dark:text-white/55">
              Mostrando {{ Math.min(perPage, filteredAndSorted.length) }} de {{ filteredAndSorted.length }} productos
              <span v-if="apiError" class="block mt-2">
                {{ apiError }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'

const { path, fullPath, setPath } = useHashRoute()

const imgSrc = (value) => {
  if (!value) return null
  const s = String(value)
  if (/^https?:\/\//i.test(s)) return s
  return `/${encodeURI(s)}`
}

const productHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/producto/${encodeURIComponent(String(slug))}`
  return `#/producto?id=${encodeURIComponent(String(id ?? ''))}`
}

// Compatibilidad: slugs antiguos → slugs nuevos
const categoryAliases = {
  refrigeradores: 'neveras',
  'neveras-ejecutiva': 'neveras',
  'congelador-dual': 'neveras',
  'exhibidores-horizontal': 'neveras',
  freezer: 'neveras',
}
const normalizeCategory = (v) => {
  const s = v == null ? null : String(v)
  if (!s) return null
  return categoryAliases[s] ?? s
}

const placeholderProducts = [
  { id: 1, name: 'Nevera Modelo SJ-200SD (demo)', category: 'neveras', currentPrice: 299.99, originalPrice: null, discount: null, isNew: true, image: null },
  { id: 2, name: 'Batidora SJ (demo)', category: 'batidoras', currentPrice: 79.99, originalPrice: null, discount: null, isNew: false, image: null },
  { id: 3, name: 'Cafetera Express (demo)', category: 'cafeteras', currentPrice: 159.99, originalPrice: null, discount: null, isNew: false, image: null },
  { id: 4, name: 'Plancha a vapor (demo)', category: 'planchas', currentPrice: 39.99, originalPrice: null, discount: null, isNew: false, image: null },
  { id: 5, name: 'Licuadora (demo)', category: 'licuadoras', currentPrice: 49.99, originalPrice: null, discount: null, isNew: false, image: null },
  { id: 6, name: 'Exprimidor (demo)', category: 'exprimidor', currentPrice: 29.99, originalPrice: null, discount: null, isNew: false, image: null }
]

const products = ref(placeholderProducts)
const isLoading = ref(true)
const apiError = ref('')

const allowedCategoryOrder = ['neveras', 'batidoras', 'cafeteras', 'planchas', 'licuadoras', 'exprimidor']
const allowedCategoryIds = new Set(allowedCategoryOrder)

const categoryIcons = {
  neveras: 'M9 3h6v18H9V3Zm0 9h6',
  batidoras: 'M10 3h4v4h-4V3Zm-1 6h6v12H9V9Zm-2 3h2m8 0h2',
  cafeteras: 'M7 8h10v6a5 5 0 0 1-10 0V8Zm10 1h1a2 2 0 0 1 0 4h-1',
  planchas: 'M6 14c0-3 3-6 6-6h3l3 6v3H6v-3Zm3 6h6',
  licuadoras: 'M10 3h4m-5 6h6l-1 12H10L9 9Zm1-3h4',
  exprimidor: 'M8 7h8m-7 4h6m-7 4h8m-6 4h4',
}

const humanizeSlug = (id) => {
  if (!id) return '—'
  const s = String(id).replaceAll('-', ' ').trim()
  if (!s) return '—'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const categories = ref(
  allowedCategoryOrder.map((id) => ({
    id,
    label: humanizeSlug(id),
    icon: categoryIcons[id] || categoryIcons.neveras,
  })),
)

const categoryLabel = (id) => categories.value.find((c) => c.id === id)?.label ?? humanizeSlug(id)

const countByCategory = computed(() => {
  const m = {}
  for (const c of categories.value) m[c.id] = 0
  for (const p of products.value) {
    if (p.category && m[p.category] !== undefined) m[p.category] += 1
  }
  return m
})

const selectedCategory = ref('all')
const showOptions = [9, 12, 18, 24]
const perPage = ref(12)
const sort = ref('default')
const view = ref('grid')

const categoryFromRoute = computed(() => {
  // Soporta: #/productos/<categoria>
  try {
    const fp = String(fullPath.value || '')
    const cleanPath = fp.split('?')[0] || ''
    const segs = cleanPath.split('/').filter(Boolean)
    if (segs[0] !== 'productos') return null
    const cat = segs[1] ? decodeURIComponent(segs[1]) : ''
    return cat || null
  } catch {
    return null
  }
})

const setCategory = (cat) => {
  const norm = normalizeCategory(cat)
  const finalCat = norm && allowedCategoryIds.has(norm) ? norm : 'all'
  selectedCategory.value = finalCat
  if (finalCat !== 'all') setPath(`/productos/${finalCat}`)
  else setPath('/productos')
}

const filteredAndSorted = computed(() => {
  const list = products.value
    .filter((p) => selectedCategory.value === 'all' || p.category === selectedCategory.value)
    .slice()

  if (sort.value === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name))
  if (sort.value === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name))
  if (sort.value === 'category') list.sort((a, b) => String(a.category).localeCompare(String(b.category)))
  return list
})

const visibleProducts = computed(() => filteredAndSorted.value.slice(0, perPage.value))

const comboList = computed(() => products.value.slice(0, 4))

onMounted(async () => {
  isLoading.value = true
  apiError.value = ''

  // Categorías desde el API (términos). No bloquea el render: usa fallback si falla.
  try {
    const r = await fetch('/api/wp-product-categories.php', { headers: { Accept: 'application/json' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const payload = await r.json()
    if (!payload?.ok || !Array.isArray(payload.categories)) throw new Error('Payload inválido')
    const bySlug = new Map(payload.categories.map((t) => [String(t.slug), String(t.name)]))
    categories.value = allowedCategoryOrder.map((id) => ({
      id,
      label: bySlug.get(id) || humanizeSlug(id),
      icon: categoryIcons[id] || categoryIcons.neveras,
    }))
  } catch {
    // Silencioso: mantener labels fallback.
    categories.value = allowedCategoryOrder.map((id) => ({
      id,
      label: humanizeSlug(id),
      icon: categoryIcons[id] || categoryIcons.neveras,
    }))
  }

  try {
    const r = await fetch('/api/wp-products.php', {
      headers: { Accept: 'application/json' }
    })

    if (!r.ok) {
      throw new Error(`HTTP ${r.status}`)
    }

    const contentType = r.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await r.text()
      const hint = text.includes('<?php')
        ? 'Parece que estás en Vite dev sirviendo PHP como texto. Arranca el proxy con `npm run dev:php`.'
        : 'La respuesta no fue JSON.'
      throw new Error(`${hint} (content-type: "${contentType || '—'}")`)
    }

    const payload = await r.json()
    if (!payload?.ok || !Array.isArray(payload.products)) {
      throw new Error('Payload inválido')
    }

    products.value = payload.products.map((p, idx) => ({
      id: p?.id ?? `wp-${idx}`,
      slug: p?.slug ?? null,
      name: p?.name ?? 'Producto',
      category: normalizeCategory(p?.category ?? null),
      image: p?.image ?? null
    }))
  } catch (e) {
    apiError.value = `No pudimos cargar productos. Mostrando datos de ejemplo. (${e?.message ?? 'Error desconocido'})`
    products.value = placeholderProducts
  } finally {
    isLoading.value = false
  }
})

// Mantener filtro sincronizado con URL amigable.
watch(categoryFromRoute, (cat) => {
  if (!cat) {
    selectedCategory.value = 'all'
    return
  }
  const norm = normalizeCategory(cat)
  if (!norm || !allowedCategoryIds.has(norm)) {
    selectedCategory.value = 'all'
    return
  }
  selectedCategory.value = norm
  if (norm !== cat) setPath(`/productos/${norm}`)
}, { immediate: true })
</script>

