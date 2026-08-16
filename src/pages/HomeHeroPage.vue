<template>
  <div class="bg-white dark:bg-sj-black text-neutral-900 dark:text-white">
    <SJHeroSlideshow
      eyebrow="SJ Electronics"
      :slides="heroSlides"
      :backgrounds="heroBackgrounds"
      show-controls
      :interval-ms="4200"
    >
      <template #ctas>
        <a class="btn btn-primary" href="#/productos">Ver catálogo</a>
        <a
          class="btn btn-outline border-white/30 text-white hover:bg-white/10 active:bg-white/15"
          :href="whatsappHref"
          target="_blank"
          rel="noreferrer"
        >
          Escríbenos por WhatsApp
        </a>
      </template>
    </SJHeroSlideshow>

    <!-- Categorías destacadas -->
    <section class="pt-14 sm:pt-16 lg:pt-20 pb-6 sm:pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400">
          Más cerca de ti
        </p>
        <h2 class="mt-3 font-display font-bold text-3xl sm:text-4xl leading-tight">
          Encuentra lo que tu hogar necesita
        </h2>

        <div class="grid sm:grid-cols-3 gap-5 sm:gap-6 mt-10">
          <a
            v-for="c in categories"
            :key="c.label"
            :href="c.href"
            class="group relative aspect-[4/3] overflow-hidden border border-neutral-200 dark:border-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary-500/45"
          >
            <img
              :src="c.image"
              :alt="c.label"
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-sj-black/85 via-sj-black/20 to-transparent" />
            <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <div class="text-white font-display font-bold text-xl sm:text-2xl">{{ c.label }}</div>
              <div class="text-white/70 text-sm mt-1">{{ c.hint }}</div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Destacados -->
    <section class="pt-6 sm:pt-8 pb-16 sm:pb-20 lg:pb-24 bg-sj-black text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-400">Catálogo</p>
            <h2 class="mt-3 font-display font-bold text-3xl sm:text-4xl">
              Productos destacados
            </h2>
            <p v-if="isCatalogFallback" class="mt-2 text-xs font-medium text-white/40">
              Mostrando catálogo de demostración.
            </p>
          </div>
          <a
            class="btn btn-outline border-white/25 text-white hover:bg-white/10 active:bg-white/15"
            href="#/productos"
          >
            Ver todo
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-10">
          <a
            v-for="p in featuredTop4"
            :key="p.id"
            :href="productHref(p)"
            class="group block focus:outline-none"
          >
            <div class="bg-white border border-white/10 overflow-hidden focus-within:ring-4 focus-within:ring-brand-primary-500/45">
              <div class="aspect-[4/3] flex items-center justify-center">
                <img
                  v-if="imgSrc(p.image)"
                  :src="imgSrc(p.image)"
                  :alt="p.name"
                  class="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-white">
                  <svg viewBox="0 0 24 24" fill="none" class="h-12 w-12 text-neutral-300">
                    <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8 13l2.5-2.5a1 1 0 0 1 1.4 0L16 14.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.5 12.5 16 11a1 1 0 0 1 1.4 0L20 13.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="mt-3 text-center">
              <div class="text-sm font-semibold text-white/95 leading-snug line-clamp-2 group-focus-visible:underline underline-offset-4">
                {{ p.name }}
              </div>
              <div class="text-xs text-white/55 mt-1">
                {{ categoryLabel(p.category) }}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Bloque de confianza -->
    <section class="py-14 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div v-for="t in trust" :key="t.title">
            <div class="h-10 w-10 flex items-center justify-center text-brand-primary-600 dark:text-brand-primary-500">
              <svg viewBox="0 0 24 24" fill="none" class="h-8 w-8">
                <path :d="t.icon" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="mt-3 font-display font-bold text-lg">{{ t.title }}</h3>
            <p class="mt-1.5 text-sm text-neutral-600 dark:text-white/65 leading-relaxed">{{ t.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Últimos posts -->
    <section class="py-16 sm:py-20 lg:py-24 bg-neutral-50 dark:bg-white/[0.03]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between gap-6">
          <div>
            <h2 class="font-display font-bold text-3xl sm:text-4xl">Últimos posts</h2>
            <p class="text-neutral-600 dark:text-white/70 mt-2 text-base sm:text-lg">Lo más reciente.</p>
          </div>
          <a
            class="text-sm font-semibold text-brand-primary-700 dark:text-brand-primary-400 hover:text-brand-primary-800 dark:hover:text-brand-primary-300 transition-colors"
            href="#/posts"
          >
            Ver todo
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <a
            v-for="p in latestPosts"
            :key="p.id"
            :href="postHref(p)"
            class="group block focus:outline-none"
          >
            <div class="bg-white dark:bg-white/5 border border-neutral-900/10 dark:border-white/10 overflow-hidden focus-within:ring-4 focus-within:ring-brand-primary-500/45">
              <div class="aspect-[16/9] flex items-center justify-center">
                <img
                  v-if="imgSrc(p.image)"
                  :src="imgSrc(p.image)"
                  :alt="p.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-white/5">
                  <svg viewBox="0 0 24 24" fill="none" class="h-12 w-12 text-neutral-300 dark:text-white/20">
                    <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8 13l2.5-2.5a1 1 0 0 1 1.4 0L16 14.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.5 12.5 16 11a1 1 0 0 1 1.4 0L20 13.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="mt-3">
              <div class="text-sm font-semibold text-neutral-900 dark:text-white/90 leading-snug line-clamp-2 group-focus-visible:underline underline-offset-4">
                {{ p.title }}
              </div>
              <div v-if="p.excerpt" class="text-xs text-neutral-600 dark:text-white/60 mt-1 line-clamp-2">
                {{ p.excerpt }}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA de cierre -->
    <section class="bg-brand-primary-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 class="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
          SJ Electronics, <span class="italic">más cerca de ti</span>
        </h2>
        <p class="mt-4 text-white/85 text-base sm:text-lg max-w-2xl mx-auto">
          Distribución nacional, garantía y asesoría real para el electrodoméstico que necesitas.
        </p>
        <div class="mt-8">
          <a
            class="inline-flex items-center justify-center min-h-[44px] px-6 border-2 border-white bg-white text-brand-primary-700 font-semibold hover:bg-white/90 transition focus-ring"
            href="#/productos"
          >
            Ver catálogo
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'
import { publicAssetUrl } from '../utils/publicAssetUrl'
import { useProductList, usePostList, categoryLabelFrom, defaultCategoryLabel } from '../composables/useCatalogSource'
import { usePageMeta } from '../composables/usePageMeta'
import { whatsappLink } from '../config/whatsapp'

usePageMeta({
  path: '/',
  description: 'Air fryers, sandwicheras, parrillas, ollas, licuadoras y repuestos con garantía, asesoría y distribución a nivel nacional.',
})

const srcFor = (filename) => publicAssetUrl(filename)
const imgSrc = (value) => publicAssetUrl(value)

// Fondos: banners existentes (publicDir = imagen/), producto + ambiente ya fotografiado,
// más los banners nuevos de imagen/banner/ agregados como ítems extra del mismo carrusel
// (mismo hero, sin crear una sección aparte).
const heroBackgrounds = computed(() => [
  srcFor('banner 2026-02-07 at 15.10.29.png'),
  srcFor('banner 2026-02-07 at 15.09.20.png'),
  srcFor('banner 2026-02-07 at 15.11.01.png'),
  srcFor('banner/baner1.jpeg'),
  srcFor('banner/banner2.jpeg'),
  srcFor('banner/banner3.jpeg'),
  srcFor('banner/banner4.jpeg'),
  srcFor('banner/banner5.jpeg'),
  srcFor('banner/banner6.jpeg'),
])

// Hero producto-protagonista: máx. 3 slides, copy corto, mismo CTA (catálogo + WhatsApp).
const heroSlides = [
  {
    title: 'Tecnología que se siente cerca',
    subtitle: 'Electrodomésticos para tu cocina y tu hogar, con garantía y asesoría real.',
  },
  {
    title: 'Cocina como quieras cocinar',
    subtitle: 'Air fryers, parrillas, sandwicheras y más: potencia y diseño en tu día a día.',
  },
  {
    title: 'Soporte y repuestos cuando los necesitas',
    subtitle: 'Distribución a nivel nacional, asesoría clara y repuestos disponibles.',
  },
]

const whatsappHref = computed(() => whatsappLink('Hola SJ Electronics, quiero más información sobre sus productos.'))

const categories = [
  { label: 'Cocina', hint: 'Air fryers, parrillas, sandwicheras', href: '#/productos', image: srcFor('banner 2026-02-07 at 15.09.20.png') },
  { label: 'Hogar', hint: 'Ollas y licuadoras', href: '#/productos', image: srcFor('banner 2026-02-07 at 15.10.29.png') },
  { label: 'Repuestos', hint: 'Piezas y asesoría técnica', href: '#/productos/repuestos', image: srcFor('banner 2026-02-07 at 15.11.01.png') },
]

const trustIcons = {
  distribucion: 'M3 12h18M3 12l4-6h10l4 6M3 12l4 6h10l4-6',
  garantia: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 9.2 1.8 1.8 3.2-3.6',
  asesoria: 'M8 10h8M8 14h5M21 12c0 4.4-4 8-9 8-1.2 0-2.4-.2-3.4-.6L3 21l1.7-4.2A7.9 7.9 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z',
  repuestos: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z',
}

const trust = [
  { title: 'Distribución nacional', text: 'Llegamos a distribuidores en todo el país.', icon: trustIcons.distribucion },
  { title: 'Garantía', text: 'Productos respaldados con garantía del fabricante.', icon: trustIcons.garantia },
  { title: 'Asesoría', text: 'Te ayudamos a elegir el equipo correcto para tu hogar.', icon: trustIcons.asesoria },
  { title: 'Repuestos', text: 'Piezas y soporte técnico disponibles.', icon: trustIcons.repuestos },
]

const { products: featured, categories: productCategories, isFallback: isCatalogFallback } = useProductList()
const featuredTop4 = computed(() => featured.value.slice(0, 4))
const categoryLabel = (id) => categoryLabelFrom(productCategories, id) || defaultCategoryLabel(id)

const { posts: allPosts } = usePostList(3)
const latestPosts = computed(() => allPosts.value.slice(0, 3))

const productHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/producto/${encodeURIComponent(String(slug))}`
  return `#/producto?id=${encodeURIComponent(String(id ?? ''))}`
}

const postHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/post/${encodeURIComponent(String(slug))}`
  return `#/post?id=${encodeURIComponent(String(id ?? ''))}`
}

</script>
