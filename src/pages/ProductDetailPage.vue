<template>
  <div class="bg-white text-neutral-900 dark:bg-sj-black dark:text-white">
    <section>
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p v-if="isFallback && product" class="mb-6 text-xs font-medium text-neutral-500 dark:text-white/45 border border-neutral-200 dark:border-white/10 px-3 py-2 inline-block">
          Mostrando ficha de demostración.
        </p>
        <div
          v-if="error"
          class="mb-6 border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
        >
          <p class="text-sm text-neutral-700 dark:text-white/80">
            {{ error }}
          </p>
        </div>

        <div class="grid lg:grid-cols-12 gap-8 items-start">
          <!-- Media column (thumbs + main) -->
          <div class="lg:col-span-7">
            <div class="grid grid-cols-[72px,1fr] gap-4">
              <!-- Thumbnails -->
              <div class="space-y-3">
                <button
                  v-for="(src, idx) in gallery"
                  :key="`${src}-${idx}`"
                  type="button"
                  class="relative w-[72px] h-[72px] overflow-hidden border bg-white focus-ring"
                  :class="idx === selectedIdx ? 'border-brand-primary-600 ring-2 ring-brand-primary-500/40' : 'border-neutral-200 hover:border-neutral-900/25 dark:hover:border-white/30 dark:bg-white/5 dark:border-white/15'"
                  @click="selectedIdx = idx"
                >
                  <img
                    v-if="imgSrc(src)"
                    :src="imgSrc(src)"
                    alt=""
                    class="w-full h-full object-contain p-1"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </div>

              <!-- Main image -->
              <div class="relative bg-white border border-neutral-200 dark:border-white/10 overflow-hidden">
                <div class="aspect-[4/3] flex items-center justify-center">
                  <img
                    v-if="imgSrc(activeImage)"
                    :src="imgSrc(activeImage)"
                    :alt="product?.name || 'Producto'"
                    class="w-full h-full object-contain p-6"
                    loading="lazy"
                    decoding="async"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-white">
                    <svg viewBox="0 0 24 24" fill="none" class="h-16 w-16 text-neutral-300">
                      <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke="currentColor" stroke-width="1.7"/>
                      <path d="M8 13l2.5-2.5a1 1 0 0 1 1.4 0L16 14.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14.5 12.5 16 11a1 1 0 0 1 1.4 0L20 13.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>

                <!-- Fullscreen button -->
                <a
                  v-if="imgSrc(activeImage)"
                  :href="imgSrc(activeImage)"
                  target="_blank"
                  rel="noreferrer"
                  class="absolute left-4 bottom-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-sj-black/80 text-white border border-white/10 hover:bg-sj-black transition focus-ring"
                  aria-label="Ver imagen en pantalla completa"
                  title="Pantalla completa"
                >
                  <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Content panel -->
          <div class="lg:col-span-5">
            <div>
              <!-- Top row: breadcrumb + actions -->
              <div class="flex items-start justify-between gap-6">
                <div class="text-sm text-neutral-600 dark:text-white/60">
                  <a class="hover:text-neutral-900 dark:hover:text-white transition" href="#/productos">Productos</a>
                  <span class="text-neutral-300 dark:text-white/30 px-1.5">/</span>
                  <a
                    class="text-neutral-800 hover:text-neutral-900 transition font-semibold dark:text-white/70 dark:hover:text-white"
                    :href="product?.category ? `#/productos/${encodeURIComponent(String(product.category))}` : '#/productos'"
                  >
                    {{ categoryLabel }}
                  </a>
                </div>

                <a
                  href="#/productos"
                  class="inline-flex items-center justify-center h-9 w-9 border border-neutral-200 bg-white hover:bg-neutral-50 transition focus-ring dark:border-white/15 dark:bg-white/0 dark:hover:bg-white/5"
                  aria-label="Volver al catálogo"
                  title="Volver"
                >
                  <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </div>

              <div class="flex items-start justify-between gap-4 mt-5">
                <h1 class="font-display font-bold text-3xl sm:text-4xl leading-tight">
                  {{ product?.name || (isLoading ? 'Cargando…' : 'Producto') }}
                </h1>
                <span v-if="product?.model" class="shrink-0 mt-1.5 text-xs font-mono font-semibold text-neutral-500 dark:text-white/45">
                  {{ product.model }}
                </span>
              </div>

              <p v-if="product?.excerpt" class="mt-4 text-sm sm:text-base text-neutral-600 dark:text-white/70 leading-relaxed">
                {{ product.excerpt }}
              </p>

              <!-- CTA principal -->
              <div class="mt-8 flex flex-wrap gap-3">
                <a
                  :href="whatsappHref"
                  target="_blank"
                  rel="noreferrer"
                  class="btn btn-primary"
                >
                  Consultar por WhatsApp
                </a>
                <a
                  :href="specSheetHref || '#'"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center justify-center min-h-[44px] px-5 border-2 border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-white/85 font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition focus-ring"
                  :class="!specSheetHref ? 'opacity-40 pointer-events-none' : ''"
                >
                  Ficha técnica
                </a>
              </div>

              <div v-if="isLoading" class="mt-6 text-sm text-neutral-600 dark:text-white/55">
                Cargando información del producto…
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs: Descripción / Especificaciones -->
        <div class="mt-14 border-t border-neutral-200 dark:border-white/10 pt-10">
          <div class="flex items-center justify-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 dark:text-white/60">
            <button
              type="button"
              class="pb-3 transition focus-ring"
              :class="activeTab === 'description' ? 'text-neutral-900 border-b-2 border-brand-primary-600 dark:text-white' : 'hover:text-neutral-900 dark:hover:text-white'"
              @click="activeTab = 'description'"
            >
              Descripción
            </button>
            <button
              type="button"
              class="pb-3 transition focus-ring"
              :class="activeTab === 'additional' ? 'text-neutral-900 border-b-2 border-brand-primary-600 dark:text-white' : 'hover:text-neutral-900 dark:hover:text-white'"
              @click="activeTab = 'additional'"
            >
              Especificaciones
            </button>
          </div>

          <div class="mt-10 max-w-6xl mx-auto">
            <div v-if="activeTab === 'description'" class="grid lg:grid-cols-12 gap-10">
              <div class="lg:col-span-8">
                <h3 class="text-sm font-semibold text-neutral-900 dark:text-white/90">Características destacadas</h3>

                <div
                  v-if="safeDescriptionHtml"
                  class="mt-4 prose prose-neutral max-w-none dark:prose-invert prose-sm prose-a:text-brand-primary-700 dark:prose-a:text-brand-primary-400 prose-a:underline underline-offset-4"
                  v-html="safeDescriptionHtml"
                />

                <ul v-if="product?.attributes?.length" class="mt-6 space-y-3 text-sm text-neutral-700 dark:text-white/75">
                  <li v-for="(a, idx) in product.attributes" :key="idx" class="flex gap-3">
                    <span class="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary-600 shrink-0"></span>
                    <span>
                      <span class="font-semibold text-neutral-900 dark:text-white/90">{{ a.label }}:</span>
                      {{ a.value }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="lg:col-span-4">
                <div class="border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 p-5">
                  <div class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 dark:text-white/55">Resumen</div>
                  <div class="mt-3 space-y-2 text-sm text-neutral-700 dark:text-white/75">
                    <div><span class="text-neutral-900 font-semibold dark:text-white/90">Categoría:</span> {{ categoryLabel }}</div>
                    <div v-if="product?.model"><span class="text-neutral-900 font-semibold dark:text-white/90">Modelo:</span> {{ product.model }}</div>
                    <div v-if="product?.slug"><span class="text-neutral-900 font-semibold dark:text-white/90">Código:</span> {{ product.slug }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="max-w-4xl mx-auto">
              <div class="border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/0">
                <table class="w-full text-sm">
                  <tbody>
                    <tr v-for="(row, idx) in additionalRows" :key="idx" class="border-b border-neutral-200 last:border-b-0 dark:border-white/10">
                      <th class="text-left px-5 py-4 font-semibold text-neutral-800 w-1/2 dark:text-white/80">{{ row[0] }}</th>
                      <td class="px-5 py-4 text-neutral-600 dark:text-white/70">{{ row[1] }}</td>
                    </tr>
                    <tr v-if="!additionalRows.length" class="border-b border-neutral-200 dark:border-white/10">
                      <td class="px-5 py-4 text-neutral-600 dark:text-white/70" colspan="2">No hay información adicional disponible.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Related products -->
        <div v-if="related.length" class="mt-14 border-t border-neutral-200 dark:border-white/10 pt-10">
          <div class="flex items-end justify-between gap-6">
            <h2 class="font-display font-bold text-xl">También te puede interesar</h2>
            <div class="flex items-center gap-3" v-if="relatedPages.length > 1">
              <button
                type="button"
                class="h-10 w-10 inline-flex items-center justify-center border border-neutral-200 bg-white hover:bg-neutral-50 transition focus-ring disabled:opacity-40 dark:border-white/15 dark:bg-white/0 dark:hover:bg-white/5"
                :disabled="relatedPage === 0"
                @click="relatedPage = Math.max(0, relatedPage - 1)"
                aria-label="Anterior"
              >
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                class="h-10 w-10 inline-flex items-center justify-center border border-neutral-200 bg-white hover:bg-neutral-50 transition focus-ring disabled:opacity-40 dark:border-white/15 dark:bg-white/0 dark:hover:bg-white/5"
                :disabled="relatedPage >= relatedPages.length - 1"
                @click="relatedPage = Math.min(relatedPages.length - 1, relatedPage + 1)"
                aria-label="Siguiente"
              >
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div class="mt-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <a
                v-for="rp in relatedPages[relatedPage] || []"
                :key="rp.id"
                :href="productHref(rp)"
                class="group block border border-neutral-200 bg-white overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary-500/45 dark:border-white/10 dark:bg-white/0"
              >
                <div class="bg-neutral-50 dark:bg-white/5">
                  <div class="aspect-[4/3] flex items-center justify-center">
                    <img v-if="imgSrc(rp.image)" :src="imgSrc(rp.image)" :alt="rp.name" class="w-full h-full object-contain p-3" loading="lazy" decoding="async" />
                    <div v-else class="w-full h-full flex items-center justify-center bg-white">
                      <svg viewBox="0 0 24 24" fill="none" class="h-10 w-10 text-neutral-300">
                        <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke="currentColor" stroke-width="1.7"/>
                        <path d="M8 13l2.5-2.5a1 1 0 0 1 1.4 0L16 14.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="p-4 text-center">
                  <div class="text-sm font-semibold text-neutral-900 dark:text-white/90 leading-snug line-clamp-2 group-hover:underline underline-offset-4">
                    {{ rp.name }}
                  </div>
                  <div class="text-xs text-neutral-600 dark:text-white/55 mt-1">{{ defaultCategoryLabel(rp.category) }}</div>
                </div>
              </a>
            </div>

            <div class="mt-6 flex items-center justify-center gap-2" v-if="relatedPages.length > 1">
              <button
                v-for="(_, idx) in relatedPages"
                :key="idx"
                type="button"
                class="h-2 w-2 rounded-full transition"
                :class="idx === relatedPage ? 'bg-brand-primary-600' : 'bg-neutral-300 hover:bg-neutral-400 dark:bg-white/25 dark:hover:bg-white/45'"
                @click="relatedPage = idx"
                :aria-label="`Ir a página ${idx + 1}`"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'
import { useProduct, imgSrc, defaultCategoryLabel } from '../composables/useCatalogSource'
import { safeHref } from '../utils/publicAssetUrl'
import { usePageMeta, useJsonLd } from '../composables/usePageMeta'
import { useSanitizedHtml } from '../composables/useSanitizedHtml'

const { fullPath } = useHashRoute()

const productId = computed(() => {
  try {
    const fp = String(fullPath.value || '')
    const [, queryPart] = fp.split('?')
    const params = new URLSearchParams(queryPart || '')
    const id = params.get('id')
    const n = Number(id)
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
})

const productSlug = computed(() => {
  try {
    const fp = String(fullPath.value || '')
    const pathPart = fp.split('?')[0] || ''
    const segs = pathPart.split('/').filter(Boolean)
    if (segs[0] !== 'producto') return null
    const slug = segs[1] ? decodeURIComponent(segs[1]) : ''
    return slug || null
  } catch {
    return null
  }
})

const { product, related, isLoading, isFallback, error } = useProduct(productId, productSlug)

const categoryLabel = computed(() => product.value?.categoryName || defaultCategoryLabel(product.value?.category))

usePageMeta({
  title: computed(() => product.value?.name),
  description: computed(() => product.value?.excerpt),
  image: computed(() => imgSrc(product.value?.image)),
  path: computed(() => (product.value?.slug ? `/producto/${product.value.slug}` : '/productos')),
  type: 'product',
})

useJsonLd('jsonld-product', computed(() => {
  if (!product.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.value.name,
    description: product.value.excerpt || undefined,
    image: imgSrc(product.value.image) || undefined,
    category: categoryLabel.value || undefined,
    sku: product.value.model || undefined,
    brand: { '@type': 'Brand', name: 'SJ Electronics' },
  }
}))

const selectedIdx = ref(0)

const gallery = computed(() => {
  const imgs = product.value?.images
  if (Array.isArray(imgs) && imgs.length) return imgs
  return product.value?.image ? [product.value.image] : []
})

const activeImage = computed(() => gallery.value[selectedIdx.value] ?? gallery.value[0] ?? null)

const whatsappHref = computed(() => {
  const name = product.value?.name || 'este producto'
  const model = product.value?.model ? ` (${product.value.model})` : ''
  const text = encodeURIComponent(`Hola SJ Electronics, quiero más información sobre ${name}${model}.`)
  return `https://wa.me/?text=${text}`
})

const specSheetHref = computed(() => safeHref(product.value?.documents?.specSheet?.url))

const activeTab = ref('description')

const safeDescriptionHtml = useSanitizedHtml(computed(() => product.value?.descriptionHtml || ''))

const additionalRows = computed(() => {
  const rows = []
  const p = product.value || {}
  if (p.category) rows.push(['Categoría', categoryLabel.value])
  if (p.model) rows.push(['Modelo', p.model])
  if (p.slug) rows.push(['Código', p.slug])

  const attrs = Array.isArray(p.attributes) ? p.attributes : []
  for (const a of attrs.slice(0, 20)) {
    const label = (a && typeof a.label === 'string' ? a.label : '').trim()
    const value = (a && typeof a.value === 'string' ? a.value : '').trim()
    if (!label || !value) continue
    rows.push([label, value])
  }
  return rows.slice(0, 14)
})

const productHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/producto/${encodeURIComponent(String(slug))}`
  return `#/producto?id=${encodeURIComponent(String(id ?? ''))}`
}

const relatedPage = ref(0)

const relatedPages = computed(() => {
  const size = 4
  const list = related.value || []
  const pages = []
  for (let i = 0; i < list.length; i += size) pages.push(list.slice(i, i + size))
  return pages.slice(0, 2)
})
</script>
