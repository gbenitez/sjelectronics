<template>
  <div class="bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white">
    <section>
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div
          v-if="error"
          class="mb-6 rounded-lg border border-neutral-900/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-950/40"
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
                  class="relative w-[72px] h-[72px] overflow-hidden border border-neutral-900/15 bg-white"
                  :class="idx === selectedIdx ? 'ring-2 ring-neutral-900/70 dark:ring-white/80' : 'hover:border-neutral-900/25 dark:hover:border-white/30 dark:bg-white/5 dark:border-white/15'"
                  @click="selectedIdx = idx"
                >
                  <img
                    v-if="imgSrc(src)"
                    :src="imgSrc(src)"
                    alt=""
                    class="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </div>

              <!-- Main image -->
              <div class="relative bg-white rounded-none overflow-hidden border border-neutral-900/10 dark:border-white/10">
                <div class="aspect-[16/9] flex items-center justify-center">
                  <img
                    v-if="imgSrc(activeImage)"
                    :src="imgSrc(activeImage)"
                    :alt="product?.name || 'Producto'"
                    class="w-full h-full object-contain"
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
                  class="absolute left-4 bottom-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/80 text-white border border-white/10 hover:bg-black transition focus-ring"
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
            <div class="bg-white border border-neutral-900/10 px-0 sm:px-0 dark:bg-neutral-950 dark:border-white/10">
              <!-- Top row: breadcrumb + actions -->
              <div class="flex items-start justify-between gap-6">
                <div class="text-sm text-neutral-600 dark:text-white/60">
                  Home <span class="text-white/30 px-1">/</span>
                  <a
                    class="text-neutral-800 hover:text-neutral-900 transition font-semibold dark:text-white/70 dark:hover:text-white"
                    :href="product?.category ? `#/productos/${encodeURIComponent(String(product.category))}` : '#/productos'"
                  >
                    {{ product?.categoryName || product?.categoryLabel || 'Producto' }}
                  </a>
                </div>

                <div class="flex items-center gap-2">
                  <a
                    href="#/productos"
                    class="inline-flex items-center justify-center h-9 w-9 border border-neutral-900/10 bg-white hover:bg-neutral-900/5 transition focus-ring dark:border-white/15 dark:bg-white/0 dark:hover:bg-white/5"
                    aria-label="Volver"
                    title="Volver"
                  >
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </a>
                  <a
                    href="#/productos"
                    class="inline-flex items-center justify-center h-9 w-9 border border-neutral-900/10 bg-white hover:bg-neutral-900/5 transition focus-ring dark:border-white/15 dark:bg-white/0 dark:hover:bg-white/5"
                    aria-label="Ver grid de productos"
                    title="Grid"
                  >
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" stroke-width="1.7"/>
                    </svg>
                  </a>
                </div>
              </div>

              <h1 class="mt-5 font-display font-bold text-3xl sm:text-4xl leading-tight">
                {{ product?.name || 'Cargando…' }}
              </h1>

              <p v-if="product?.excerpt" class="mt-4 text-sm sm:text-base text-neutral-600 dark:text-white/70 leading-relaxed">
                {{ product.excerpt }}
              </p>

              <div v-if="isLoading" class="mt-6 text-sm text-neutral-600 dark:text-white/55">
                Cargando información del producto…
              </div>

              <!-- Buttons row -->
              <div class="mt-10 pt-8 border-t border-neutral-900/10 dark:border-white/10">
                <div class="flex flex-wrap gap-3">
                  <a
                    :href="product?.documents?.specSheet?.url || '#'"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center justify-center min-h-[44px] px-5 border border-neutral-900/15 bg-neutral-900/5 text-neutral-900 font-semibold hover:bg-neutral-900/10 transition focus-ring dark:border-white/25 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15"
                    :class="!product?.documents?.specSheet?.url ? 'opacity-50 pointer-events-none' : ''"
                  >
                    Ficha Técnica
                  </a>
                  <a
                    :href="product?.documents?.manual?.url || '#'"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center justify-center min-h-[44px] px-5 border border-neutral-900/15 bg-neutral-900/5 text-neutral-900 font-semibold hover:bg-neutral-900/10 transition focus-ring dark:border-white/25 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15"
                    :class="!product?.documents?.manual?.url ? 'opacity-50 pointer-events-none' : ''"
                  >
                    Manual de usuario
                  </a>
                </div>

                <div class="mt-6 text-sm text-neutral-700 dark:text-white/65">
                  <div><span class="font-semibold text-neutral-900 dark:text-white/85">Category:</span> {{ product?.categoryName || product?.categoryLabel || '—' }}</div>
                  <div class="mt-3 flex items-center gap-3">
                    <span class="font-semibold text-neutral-900 dark:text-white/85">Share:</span>
                    <a
                      v-for="s in shareLinks"
                      :key="s.label"
                      :href="s.href"
                      target="_blank"
                      rel="noreferrer"
                      class="text-neutral-700 hover:text-neutral-900 transition focus-ring inline-flex items-center justify-center h-8 w-8 border border-neutral-900/10 hover:border-neutral-900/20 dark:text-white/70 dark:hover:text-white dark:border-white/10 dark:hover:border-white/20"
                    >
                      <span class="sr-only">{{ s.label }}</span>
                      <component :is="s.icon" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs: Description / Additional information -->
        <div class="mt-14 border-t border-neutral-900/10 pt-10 dark:border-white/10">
          <div class="flex items-center justify-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 dark:text-white/60">
            <button
              type="button"
              class="pb-3 transition"
              :class="activeTab === 'description' ? 'text-neutral-900 border-b-2 border-neutral-900/70 dark:text-white dark:border-white/80' : 'hover:text-neutral-900 dark:hover:text-white'"
              @click="activeTab = 'description'"
            >
              Description
            </button>
            <button
              type="button"
              class="pb-3 transition"
              :class="activeTab === 'additional' ? 'text-neutral-900 border-b-2 border-neutral-900/70 dark:text-white dark:border-white/80' : 'hover:text-neutral-900 dark:hover:text-white'"
              @click="activeTab = 'additional'"
            >
              Additional information
            </button>
          </div>

          <div class="mt-10 max-w-6xl mx-auto">
            <div v-if="activeTab === 'description'" class="grid lg:grid-cols-12 gap-10">
              <div class="lg:col-span-8">
                <h3 class="text-sm font-semibold text-neutral-900 dark:text-white/90">Características destacadas:</h3>
                <p v-if="product?.excerpt" class="mt-3 text-sm text-neutral-600 dark:text-white/70 leading-relaxed">
                  {{ product.excerpt }}
                </p>

                <ul v-if="descriptionBullets.length" class="mt-6 space-y-3 text-sm text-neutral-700 dark:text-white/75">
                  <li v-for="(b, idx) in descriptionBullets" :key="idx" class="flex gap-3">
                    <span class="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900/70 shrink-0 dark:bg-white/70"></span>
                    <span>
                      <span v-if="b.label" class="font-semibold text-neutral-900 dark:text-white/90">{{ b.label }}:</span>
                      {{ b.text }}
                    </span>
                  </li>
                </ul>

                <div
                  v-if="safeDescriptionHtml"
                  class="mt-8 prose prose-neutral max-w-none dark:prose-invert prose-sm prose-a:text-brand-primary-700 dark:prose-a:text-brand-primary-300 prose-a:underline underline-offset-4"
                  v-html="safeDescriptionHtml"
                />
              </div>

              <div class="lg:col-span-4">
                <div class="border border-neutral-900/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                  <div class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 dark:text-white/55">Resumen</div>
                  <div class="mt-3 space-y-2 text-sm text-neutral-700 dark:text-white/75">
                    <div><span class="text-neutral-900 font-semibold dark:text-white/90">Categoría:</span> {{ product?.categoryName || product?.categoryLabel || '—' }}</div>
                    <div v-if="product?.slug"><span class="text-neutral-900 font-semibold dark:text-white/90">Código:</span> {{ product.slug }}</div>
                    <div v-if="product?.id"><span class="text-neutral-900 font-semibold dark:text-white/90">ID:</span> {{ product.id }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="max-w-4xl mx-auto">
              <div class="border border-neutral-900/10 bg-white dark:border-white/10 dark:bg-white/0">
                <table class="w-full text-sm">
                  <tbody>
                    <tr v-for="(row, idx) in additionalRows" :key="idx" class="border-b border-neutral-900/10 last:border-b-0 dark:border-white/10">
                      <th class="text-left px-5 py-4 font-semibold text-neutral-800 w-1/2 dark:text-white/80">{{ row[0] }}</th>
                      <td class="px-5 py-4 text-neutral-600 dark:text-white/70">{{ row[1] }}</td>
                    </tr>
                    <tr v-if="!additionalRows.length" class="border-b border-neutral-900/10 dark:border-white/10">
                      <td class="px-5 py-4 text-neutral-600 dark:text-white/70" colspan="2">No hay información adicional disponible.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Related products carousel (2 pages) -->
        <div class="mt-14 border-t border-neutral-900/10 pt-10 dark:border-white/10">
          <div class="flex items-end justify-between gap-6">
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-white/90">Related products</h2>
            <div class="flex items-center gap-3" v-if="relatedPages.length > 1">
              <button
                type="button"
                class="h-10 w-10 inline-flex items-center justify-center border border-neutral-900/10 bg-white hover:bg-neutral-900/5 transition focus-ring disabled:opacity-40 dark:border-white/15 dark:bg-white/0 dark:hover:bg-white/5"
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
                class="h-10 w-10 inline-flex items-center justify-center border border-neutral-900/10 bg-white hover:bg-neutral-900/5 transition focus-ring disabled:opacity-40 dark:border-white/15 dark:bg-white/0 dark:hover:bg-white/5"
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
                class="group block border border-neutral-900/10 bg-white overflow-hidden focus:outline-none dark:border-white/10 dark:bg-white/0"
              >
                <div class="bg-white">
                  <div class="aspect-[16/9] flex items-center justify-center">
                    <img v-if="imgSrc(rp.image)" :src="imgSrc(rp.image)" :alt="rp.name" class="w-full h-full object-contain" loading="lazy" decoding="async" />
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
                  <div class="text-xs text-neutral-600 dark:text-white/55 mt-1">{{ rp.categoryName || rp.categoryLabel || '—' }}</div>
                </div>
              </a>
            </div>

            <div class="mt-6 flex items-center justify-center gap-2" v-if="relatedPages.length > 1">
              <button
                v-for="(_, idx) in relatedPages"
                :key="idx"
                type="button"
                class="h-2 w-2 rounded-full transition"
                :class="idx === relatedPage ? 'bg-neutral-900/70 dark:bg-white/80' : 'bg-neutral-900/20 hover:bg-neutral-900/35 dark:bg-white/25 dark:hover:bg-white/45'"
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
import { computed, onMounted, ref, watch } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'
import fallbackCatalog from '../data/fallback-catalog.json'
import { publicAssetUrl } from '../utils/publicAssetUrl'

const { fullPath } = useHashRoute()

const imgSrc = (value) => publicAssetUrl(value)

const productId = computed(() => {
  try {
    const fp = String(fullPath.value || '')
    const [pathPart, queryPart] = fp.split('?')
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

const product = ref(null)
const isLoading = ref(true)
const error = ref('')

const categoryLabel = (slug) => {
  // Mínimo: evita undefined. Si quieres, podemos reutilizar el listado de categorías del grid.
  if (!slug) return '—'
  const fromCat = (fallbackCatalog.categories || []).find((c) => c.slug === slug)
  if (fromCat?.name) return fromCat.name
  const s = String(slug).replaceAll('-', ' ').trim()
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
}

const findFallbackProductRaw = (id, slug) => {
  const list = fallbackCatalog.products || []
  if (id != null) {
    const n = Number(id)
    if (Number.isFinite(n) && n > 0) {
      const f = list.find((p) => Number(p.id) === n)
      if (f) return f
    }
  }
  if (slug) {
    const f = list.find((p) => p.slug === slug)
    if (f) return f
  }
  return null
}

const fallbackRawToProduct = (raw) => {
  const cat = raw.category || null
  const images = Array.isArray(raw.images) ? raw.images.filter(Boolean) : []
  const image = raw.image || images[0] || null
  const attrs = Array.isArray(raw.attributes)
    ? raw.attributes
        .filter((a) => a && typeof a.label === 'string' && typeof a.value === 'string')
        .map((a) => ({
          key: a.key ?? null,
          label: a.label.trim(),
          value: a.value.trim(),
        }))
    : []
  return {
    id: raw.id,
    slug: raw.slug ?? null,
    name: raw.name ?? 'Producto',
    category: cat,
    categoryName: raw.categoryName ?? null,
    categoryLabel: raw.categoryName || categoryLabel(cat),
    image,
    images: images.length ? images : image ? [image] : [],
    excerpt: raw.excerpt ?? null,
    descriptionHtml: raw.descriptionHtml ?? null,
    attributes: attrs,
    link: null,
    documents: { specSheet: null, manual: null, all: [] },
  }
}

const selectedIdx = ref(0)

const gallery = computed(() => {
  const imgs = product.value?.images
  if (Array.isArray(imgs) && imgs.length) return imgs
  return product.value?.image ? [product.value.image] : []
})

const activeImage = computed(() => gallery.value[selectedIdx.value] ?? gallery.value[0] ?? null)

const IconFacebook = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" class="h-4 w-4"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1Z" fill="currentColor"/></svg>',
}
const IconX = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" class="h-4 w-4"><path d="M6 4h4l4 6 4-6h4l-6 9 6 7h-4l-4-5-4 5H6l6-7-6-9Z" fill="currentColor"/></svg>',
}
const IconLinkedIn = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" class="h-4 w-4"><path d="M6.5 9.5H4v12h2.5v-12ZM5.25 8.2A1.45 1.45 0 1 0 5.25 5.3a1.45 1.45 0 0 0 0 2.9ZM20 21.5h-2.5v-6.2c0-1.5-.6-2.5-2-2.5-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1v6.3H11V9.5h2.4v1.6c.3-.7 1.3-1.8 3.2-1.8 2.3 0 4 1.5 4 4.8v7.4Z" fill="currentColor"/></svg>',
}
const IconWhatsApp = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" class="h-4 w-4"><path d="M12 4a8 8 0 0 0-7 12.1L4 20l4-1a8 8 0 1 0 4-15Zm4.6 11.2c-.2.6-1.1 1.1-1.7 1.2-.4.1-.9.1-1.5-.1-.4-.1-.9-.3-1.5-.6-2.6-1.3-4.3-4.1-4.4-4.3-.1-.2-1-1.3-1-2.5 0-1.2.6-1.8.8-2.1.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .4.3.2.4.6 1.5.7 1.6.1.2.1.3 0 .5-.1.2-.1.3-.2.4l-.3.4c-.1.1-.2.3-.1.5.1.2.6 1.1 1.3 1.8.9.9 1.7 1.2 1.9 1.3.2.1.4.1.5-.1l.7-.9c.1-.2.3-.2.5-.1.2.1 1.4.7 1.7.8.2.1.4.2.4.3.1.2.1.7-.1 1.2Z" fill="currentColor"/></svg>',
}

const shareLinks = computed(() => {
  const url = encodeURIComponent(product.value?.link || window.location.href)
  const text = encodeURIComponent(product.value?.name || 'Producto')
  return [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, icon: IconFacebook },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`, icon: IconX },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, icon: IconLinkedIn },
    { label: 'WhatsApp', href: `https://wa.me/?text=${text}%20${url}`, icon: IconWhatsApp },
  ]
})

const activeTab = ref('description')

const sanitizeHtml = (html) => {
  let s = String(html || '')
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  s = s.replace(/\son\w+="[^"]*"/gi, '')
  s = s.replace(/\son\w+='[^']*'/gi, '')
  s = s.replace(/javascript:/gi, '')
  return s
}

const safeDescriptionHtml = computed(() => {
  const html = product.value?.descriptionHtml
  return html ? sanitizeHtml(html) : ''
})

const descriptionBullets = computed(() => {
  const ex = String(product.value?.excerpt || '')
  if (!ex) return []
  const parts = ex.split(',').map((s) => s.trim()).filter(Boolean)
  return parts.slice(0, 12).map((p) => {
    const m = p.match(/^([^:]{2,40}):\s*(.+)$/)
    if (m) return { label: m[1].trim(), text: m[2].trim() }
    return { label: null, text: p }
  })
})

const additionalRows = computed(() => {
  const rows = []
  const p = product.value || {}
  if (p.categoryName || p.categoryLabel) rows.push(['Categoría', p.categoryName || p.categoryLabel])
  if (p.slug) rows.push(['Código', p.slug])
  if (p.id) rows.push(['ID', String(p.id)])

  const attrs = Array.isArray(p.attributes) ? p.attributes : []
  for (const a of attrs.slice(0, 20)) {
    const label = (a && typeof a.label === 'string' ? a.label : '').trim()
    const value = (a && typeof a.value === 'string' ? a.value : '').trim()
    if (!label || !value) continue
    rows.push([label, value])
  }

  const ex = String(p.excerpt || '')
  ex.split(',').map((s) => s.trim()).filter(Boolean).forEach((part) => {
    const m = part.match(/^([^:]{2,40}):\s*(.+)$/)
    if (m) rows.push([m[1].trim(), m[2].trim()])
  })
  // Limitar para que no se vuelva interminable
  return rows.slice(0, 14)
})

const productHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/producto/${encodeURIComponent(String(slug))}`
  return `#/producto?id=${encodeURIComponent(String(id ?? ''))}`
}

const related = ref([])
const relatedPage = ref(0)

const relatedPages = computed(() => {
  const size = 4
  const list = related.value || []
  const pages = []
  for (let i = 0; i < list.length; i += size) pages.push(list.slice(i, i + size))
  // “dos hojas” como pediste: máximo 2 páginas
  return pages.slice(0, 2)
})

async function loadProduct(id) {
  isLoading.value = true
  error.value = ''
  product.value = null
  selectedIdx.value = 0
  related.value = []
  relatedPage.value = 0
  activeTab.value = 'description'

  if (!id && !productSlug.value) {
    error.value = 'Producto inválido o sin ID.'
    isLoading.value = false
    return
  }

  try {
    const qs = id
      ? `id=${encodeURIComponent(String(id))}`
      : `slug=${encodeURIComponent(String(productSlug.value))}`
    const r = await fetch(`/api/wp-product.php?${qs}`, {
      headers: { Accept: 'application/json' }
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)

    const payload = await r.json()
    if (!payload?.ok || !payload.product) throw new Error('Payload inválido')

    product.value = {
      ...payload.product,
      categoryLabel: payload.product.categoryName || categoryLabel(payload.product.category),
    }
    if (payload.meta?.fallback) {
      error.value =
        'Mostrando ficha local (WordPress no disponible o producto no encontrado en el servidor remoto).'
    } else {
      error.value = ''
    }

    // Related products (misma categoría, excluyendo el actual)
    try {
      const rr = await fetch('/api/wp-products.php', { headers: { Accept: 'application/json' } })
      if (!rr.ok) throw new Error('related http')
      const pl = await rr.json()
      if (!pl?.ok || !Array.isArray(pl.products)) throw new Error('related payload')
      const cat = payload.product.category
      const pid = payload.product.id
      related.value = pl.products
        .filter((x) => x && x.id && x.id !== pid)
        .filter((x) => !cat || x.category === cat)
        .map((x) => ({
          id: x.id,
          slug: x.slug ?? null,
          name: x.name,
          category: x.category ?? null,
          categoryLabel: categoryLabel(x.category),
          categoryName: null,
          image: x.image ?? null,
        }))
        .slice(0, 8)
    } catch {
      related.value = []
    }
  } catch (e) {
    const raw = findFallbackProductRaw(productId.value, productSlug.value)
    if (raw) {
      product.value = fallbackRawToProduct(raw)
      const list = fallbackCatalog.products || []
      const pid = raw.id
      const cat = raw.category
      related.value = list
        .filter((x) => x && x.id !== pid && (!cat || x.category === cat))
        .map((x) => ({
          id: x.id,
          slug: x.slug ?? null,
          name: x.name,
          category: x.category ?? null,
          categoryLabel: categoryLabel(x.category),
          categoryName: x.categoryName ?? null,
          image: x.image ?? null,
        }))
        .slice(0, 8)
      error.value =
        'Mostrando ficha del catálogo local (sin conexión al API o error de red).'
    } else {
      error.value = `No pudimos cargar el producto. (${e?.message ?? 'Error desconocido'})`
    }
  } finally {
    isLoading.value = false
  }
}

watch(productId, (id) => {
  loadProduct(id)
}, { immediate: true })

watch(productSlug, () => {
  // Si cambia el slug (navegación amigable), recargar.
  loadProduct(productId.value)
})
</script>

