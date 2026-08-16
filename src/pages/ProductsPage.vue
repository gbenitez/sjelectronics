<template>
  <div class="bg-white dark:bg-sj-black text-neutral-900 dark:text-white">
    <section class="border-b border-neutral-200 dark:border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400">
          Catálogo
        </p>
        <h1 class="mt-3 font-display font-bold text-4xl sm:text-5xl leading-tight">
          Productos
        </h1>
        <p class="mt-4 text-lg sm:text-xl text-neutral-600 dark:text-white/70 max-w-2xl">
          Línea blanca, climatización, electrodomésticos y equipos para el hogar, el comercio y la oficina.
        </p>
      </div>
    </section>

    <section class="border-b border-neutral-200 dark:border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5">
        <!-- Selector de categoría (mega-menú) -->
        <div class="relative w-full max-w-md">
          <button
            type="button"
            class="w-full flex items-center justify-between gap-3 min-h-[48px] px-4 py-3 rounded-md border text-left transition focus-ring"
            :class="menuOpen
              ? 'bg-neutral-100 dark:bg-white/10 border-brand-primary-500'
              : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/15 hover:border-neutral-900/30 dark:hover:border-white/30'"
            @click="toggleMenu"
          >
            <span class="flex items-center gap-2.5 min-w-0">
              <span class="text-sm font-semibold uppercase tracking-wide truncate">{{ selectedLabel }}</span>
              <span class="shrink-0 font-mono text-[11px] font-medium text-neutral-500 dark:text-white/45">{{ selectedCount }}</span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" class="shrink-0 h-4 w-4 text-brand-primary-600 dark:text-brand-primary-400 transition-transform" :class="menuOpen ? 'rotate-180' : ''">
              <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button
            v-if="menuOpen"
            type="button"
            class="fixed inset-0 z-20 cursor-default"
            aria-label="Cerrar selector de categorías"
            @click="menuOpen = false"
          />

          <div
            v-if="menuOpen"
            class="absolute top-[56px] left-0 z-30 w-[min(520px,calc(100vw-2rem))] rounded-lg border border-neutral-200 dark:border-white/15 bg-white dark:bg-[#121212] p-3 shadow-lg flex flex-col gap-2.5"
          >
            <div class="flex items-center gap-2.5 rounded-md border border-neutral-200 dark:border-white/15 bg-neutral-50 dark:bg-white/5 px-3 py-2.5">
              <svg viewBox="0 0 24 24" fill="none" class="shrink-0 h-4 w-4 text-neutral-400 dark:text-white/40">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7" />
                <path d="m20 20-3.2-3.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
              <input
                v-model="qCat"
                type="text"
                :placeholder="`Escribe para filtrar las ${categoriesWithCount.length} categorías…`"
                class="w-full bg-transparent border-0 outline-none text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/40"
              />
            </div>

            <button
              type="button"
              class="text-left pb-3 border-b border-neutral-200 dark:border-white/10 text-xs font-bold uppercase tracking-wide hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition"
              @click="pickCategory('all')"
            >
              Todos los productos
              <span class="font-mono font-normal normal-case text-neutral-500 dark:text-white/45">{{ totalCount }}</span>
            </button>

            <div class="grid gap-x-3.5 gap-y-0.5 max-h-[340px] overflow-auto" style="grid-template-columns: repeat(auto-fill, minmax(190px, 1fr))">
              <button
                v-for="c in menuCategories"
                :key="c.id"
                type="button"
                class="flex items-center justify-between gap-2.5 rounded px-2 py-2.5 min-h-[40px] text-sm text-left transition"
                :class="selectedCategory === c.id
                  ? 'bg-brand-primary-600 text-white'
                  : 'text-neutral-700 dark:text-white/75 hover:bg-neutral-100 dark:hover:bg-white/10'"
                @click="pickCategory(c.id)"
              >
                <span class="truncate">{{ c.label }}</span>
                <span
                  class="font-mono text-[11px] shrink-0"
                  :class="selectedCategory === c.id ? 'text-white/80' : 'text-neutral-400 dark:text-white/40'"
                >{{ c.count }}</span>
              </button>
            </div>

            <p v-if="!menuCategories.length" class="font-mono text-xs text-neutral-400 dark:text-white/35 px-1.5">
              Ninguna categoría coincide.
            </p>
          </div>
        </div>

        <!-- Chips: categorías más buscadas -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <span class="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-white/40">Más buscados</span>
          <button
            v-for="t in topCategories"
            :key="t.id"
            type="button"
            class="rounded-pill px-4 py-2.5 min-h-[40px] text-xs font-semibold uppercase tracking-wide border transition"
            :class="selectedCategory === t.id
              ? 'bg-brand-primary-600 border-brand-primary-600 text-white'
              : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/15 text-neutral-700 dark:text-white/75 hover:border-neutral-900/30 dark:hover:border-white/30'"
            @click="toggleTopChip(t.id)"
          >
            {{ t.label }}
          </button>
        </div>

        <p v-if="isFallback" class="w-fit text-xs font-medium text-neutral-500 dark:text-white/45 border border-neutral-200 dark:border-white/10 px-3 py-2">
          Mostrando catálogo de demostración.
        </p>

        <div class="border-t border-neutral-200 dark:border-white/10 pt-4">
          <span class="font-mono text-sm text-neutral-600 dark:text-white/55">{{ resultLabel }}</span>
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div v-if="shownProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <a
          v-for="p in shownProducts"
          :key="p.id"
          :href="productHref(p)"
          class="group bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 hover:border-neutral-900/25 dark:hover:border-white/25 rounded-lg overflow-hidden flex flex-col transition focus-ring"
        >
          <div class="aspect-[4/3] bg-neutral-50 dark:bg-white/5 flex items-center justify-center overflow-hidden">
            <img
              v-if="imgSrc(p.image)"
              :src="imgSrc(p.image)"
              :alt="p.name"
              class="w-full h-full object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" class="h-12 w-12 text-neutral-300 dark:text-white/20">
                <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke="currentColor" stroke-width="1.7"/>
                <path d="M8 13l2.5-2.5a1 1 0 0 1 1.4 0L16 14.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.5 12.5 16 11a1 1 0 0 1 1.4 0L20 13.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="p-4 flex flex-col gap-1.5">
            <span class="font-mono text-[10px] font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400">
              {{ p.categoryName || categoryLabel(p.category) }}
            </span>
            <span class="text-[15px] font-semibold leading-snug line-clamp-2">{{ p.name }}</span>
            <span v-if="p.model" class="font-mono text-[11px] text-neutral-500 dark:text-white/45">{{ p.model }}</span>
          </div>
        </a>
      </div>

      <div v-else class="flex flex-col items-start gap-4 py-16">
        <span class="font-mono text-sm text-neutral-500 dark:text-white/55">Ningún producto coincide con la búsqueda.</span>
        <button
          type="button"
          class="inline-flex items-center justify-center min-h-[44px] px-5 rounded-pill bg-brand-primary-600 text-white text-xs font-bold uppercase tracking-wide hover:bg-brand-primary-700 transition focus-ring"
          @click="reset"
        >
          Limpiar filtros
        </button>
      </div>

      <div v-if="hasMore" class="flex justify-center pt-10">
        <button
          type="button"
          class="inline-flex items-center justify-center min-h-[48px] px-7 rounded-pill border border-neutral-300 dark:border-white/15 text-sm font-bold uppercase tracking-wide hover:border-brand-primary-500 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition focus-ring"
          @click="loadMore"
        >
          Cargar {{ moreCount }} más
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'
import { useProductList, imgSrc, normalizeCategory, categoryLabelFrom, defaultCategoryLabel } from '../composables/useCatalogSource'
import { usePageMeta } from '../composables/usePageMeta'

const PAGE = 24
const TOP_CHIPS = 5

const { fullPath, setPath } = useHashRoute()

usePageMeta({
  title: 'Productos',
  description: 'Catálogo SJ Electronics: línea blanca, climatización, electrodomésticos y equipos para el hogar, el comercio y la oficina.',
  path: '/productos',
})
const { products, categories, isFallback } = useProductList()

const productHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/producto/${encodeURIComponent(String(slug))}`
  return `#/producto?id=${encodeURIComponent(String(id ?? ''))}`
}

const categoryLabel = (id) => categoryLabelFrom(categories, id) || defaultCategoryLabel(id)

const selectedCategory = ref('all')
const menuOpen = ref(false)
const qCat = ref('')
const shown = ref(PAGE)

const categoryFromRoute = computed(() => {
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
  const ids = categories.value.map((c) => c.id)
  const finalCat = norm && ids.includes(norm) ? norm : 'all'
  selectedCategory.value = finalCat
  menuOpen.value = false
  qCat.value = ''
  setPath(finalCat !== 'all' ? `/productos/${finalCat}` : '/productos')
}

watch(
  categoryFromRoute,
  (cat) => {
    if (!cat) {
      selectedCategory.value = 'all'
      return
    }
    const norm = normalizeCategory(cat)
    const ids = categories.value.map((c) => c.id)
    selectedCategory.value = norm && ids.includes(norm) ? norm : 'all'
  },
  { immediate: true },
)

watch(selectedCategory, () => {
  shown.value = PAGE
})

const totalCount = computed(() => products.value.length)

const countsByCategory = computed(() => {
  const m = new Map()
  for (const p of products.value) {
    m.set(p.category, (m.get(p.category) || 0) + 1)
  }
  return m
})

const categoriesWithCount = computed(() =>
  categories.value.map((c) => ({ id: c.id, label: c.label, count: countsByCategory.value.get(c.id) || 0 })),
)

const menuCategories = computed(() => {
  const q = qCat.value.trim().toLowerCase()
  return categoriesWithCount.value
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label, 'es'))
    .filter((c) => !q || c.label.toLowerCase().includes(q))
})

const topCategories = computed(() =>
  categoriesWithCount.value
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_CHIPS),
)

const selectedLabel = computed(() =>
  selectedCategory.value === 'all'
    ? 'Todas las categorías'
    : categoriesWithCount.value.find((c) => c.id === selectedCategory.value)?.label || categoryLabel(selectedCategory.value),
)

const selectedCount = computed(() =>
  selectedCategory.value === 'all'
    ? totalCount.value
    : countsByCategory.value.get(selectedCategory.value) || 0,
)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  qCat.value = ''
}

const pickCategory = (id) => setCategory(id)

const toggleTopChip = (id) => {
  setCategory(selectedCategory.value === id ? 'all' : id)
}

const visibleProducts = computed(() => {
  if (selectedCategory.value === 'all') return products.value
  return products.value.filter((p) => p.category === selectedCategory.value)
})

const shownProducts = computed(() => visibleProducts.value.slice(0, shown.value))
const hasMore = computed(() => shown.value < visibleProducts.value.length)
const moreCount = computed(() => Math.min(PAGE, visibleProducts.value.length - shown.value))
const loadMore = () => {
  shown.value += PAGE
}

const resultLabel = computed(() => {
  const total = visibleProducts.value.length
  const n = shownProducts.value.length
  const base = n < total ? `${n} de ${total}` : `${total}`
  const suffix = selectedCategory.value !== 'all' ? ` · ${selectedLabel.value}` : ''
  return `${base} producto${total === 1 ? '' : 's'}${suffix}`
})

const reset = () => setCategory('all')
</script>
