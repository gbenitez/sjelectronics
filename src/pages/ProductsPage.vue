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
          Air fryers, sandwicheras, parrillas, ollas, licuadoras y repuestos para tu cocina y tu hogar.
        </p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <!-- Filtro por categoría + buscador -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div class="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            type="button"
            class="shrink-0 text-xs font-semibold uppercase tracking-wide px-3.5 py-2 border transition focus-ring"
            :class="selectedCategory === 'all'
              ? 'bg-brand-primary-600 border-brand-primary-600 text-white'
              : 'border-neutral-300 dark:border-white/15 text-neutral-700 dark:text-white/75 hover:border-neutral-900/30 dark:hover:border-white/30'"
            @click="setCategory('all')"
          >
            Todos
          </button>
          <button
            v-for="c in categories"
            :key="c.id"
            type="button"
            class="shrink-0 text-xs font-semibold uppercase tracking-wide px-3.5 py-2 border transition focus-ring"
            :class="selectedCategory === c.id
              ? 'bg-brand-primary-600 border-brand-primary-600 text-white'
              : 'border-neutral-300 dark:border-white/15 text-neutral-700 dark:text-white/75 hover:border-neutral-900/30 dark:hover:border-white/30'"
            @click="setCategory(c.id)"
          >
            {{ c.label }}
          </button>
        </div>

        <label class="relative block w-full lg:w-72 shrink-0">
          <span class="sr-only">Buscar productos</span>
          <svg viewBox="0 0 24 24" fill="none" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-white/40">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7" />
            <path d="m20 20-3.2-3.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Buscar por nombre o modelo…"
            class="w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-md border bg-white dark:bg-white/5 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/40 border-neutral-200 dark:border-white/10 focus:outline-none focus:ring-3 focus:ring-brand-primary-500/35 focus:border-brand-primary-500"
          />
        </label>
      </div>

      <p v-if="isFallback" class="mb-6 text-xs font-medium text-neutral-500 dark:text-white/45 border border-neutral-200 dark:border-white/10 px-3 py-2 inline-block">
        Mostrando catálogo de demostración.
      </p>

      <!-- Grid -->
      <div v-if="visibleProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="p in visibleProducts"
          :key="p.id"
          class="group relative bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 hover:border-neutral-900/25 dark:hover:border-white/25 transition"
        >
          <a
            class="absolute inset-0 z-[1] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary-500/45"
            :href="productHref(p)"
            :aria-label="`Ver ${p.name}`"
          />
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

          <div class="p-5">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-semibold leading-snug line-clamp-2">{{ p.name }}</h3>
              <span v-if="p.model" class="shrink-0 text-[11px] font-mono font-semibold text-neutral-500 dark:text-white/45 mt-0.5">
                {{ p.model }}
              </span>
            </div>
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400 mt-2">
              {{ categoryLabel(p.category) }}
            </p>
            <p v-if="p.excerpt" class="text-sm text-neutral-600 dark:text-white/60 mt-2 line-clamp-2">
              {{ p.excerpt }}
            </p>

            <a
              :href="whatsappHrefFor(p)"
              target="_blank"
              rel="noreferrer"
              class="relative z-[2] mt-4 inline-flex items-center justify-center min-h-[40px] px-4 border-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white text-sm font-semibold hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition focus-ring"
            >
              Consultar
            </a>
          </div>
        </article>
      </div>

      <p v-else class="text-neutral-600 dark:text-white/60 py-16 text-center">
        No encontramos productos con ese filtro.
      </p>

      <p class="mt-8 text-sm text-neutral-600 dark:text-white/55">
        Mostrando {{ visibleProducts.length }} de {{ products.length }} productos
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'
import { useProductList, imgSrc, normalizeCategory, categoryLabelFrom, defaultCategoryLabel } from '../composables/useCatalogSource'
import { usePageMeta } from '../composables/usePageMeta'

const { fullPath, setPath } = useHashRoute()

usePageMeta({
  title: 'Productos',
  description: 'Catálogo SJ Electronics: air fryers, sandwicheras, parrillas, ollas, licuadoras y repuestos.',
  path: '/productos',
})
const { products, categories, isFallback } = useProductList()

const productHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/producto/${encodeURIComponent(String(slug))}`
  return `#/producto?id=${encodeURIComponent(String(id ?? ''))}`
}

const whatsappHrefFor = (p) => {
  const text = encodeURIComponent(`Hola SJ Electronics, quiero más información sobre ${p.name}${p.model ? ` (${p.model})` : ''}.`)
  return `https://wa.me/?text=${text}`
}

const categoryLabel = (id) => categoryLabelFrom(categories, id) || defaultCategoryLabel(id)

const selectedCategory = ref('all')
const query = ref('')

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

const visibleProducts = computed(() => {
  const q = query.value.trim().toLowerCase()
  return products.value.filter((p) => {
    if (selectedCategory.value !== 'all' && p.category !== selectedCategory.value) return false
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      (p.model || '').toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q)
    )
  })
})
</script>
