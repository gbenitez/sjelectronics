<template>
  <div class="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
    <SJHeroSlideshow
      title="Minimalismo cálido para tu hogar"
      subtitle="Tecnología y electrodomésticos con asesoría clara, entregas seguras y soporte cercano."
      eyebrow="SJ Electronics"
      :slides="heroPostSlides"
      :backgrounds="heroPostBackgrounds"
      show-controls
      show-slide-cta
      :interval-ms="3600"
    >
    </SJHeroSlideshow>

    <!-- Mismo contenido del Home (debajo del HERO) -->
    <section class="py-14 sm:py-16 lg:py-20 bg-neutral-50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div class="lg:col-span-6">
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400">
              Más cerca de ti
            </p>
            <h2 class="mt-3 font-display font-bold text-4xl sm:text-5xl leading-tight text-neutral-900 dark:text-white">
              Ofertas y productos para tu hogar
            </h2>
            <p class="mt-4 text-lg sm:text-xl text-neutral-600 dark:text-white/70 max-w-xl">
              Neveras, aires, lavandería, cocina y más. Calidad, garantía y asesoría clara.
            </p>
            <div class="flex flex-wrap gap-4 mt-8">
              <a class="btn btn-primary" href="#/productos">Ver productos</a>
              <a class="btn btn-outline" href="#/contacto">Hablar con ventas</a>
            </div>
          </div>

          <div class="lg:col-span-6">
            <div class="aspect-[4/3] bg-neutral-200 dark:bg-white/5 border border-neutral-200 dark:border-white/10 overflow-hidden">
              <img
                :src="contentImage"
                alt="Interior minimalista con luz natural"
                class="w-full h-full object-cover sj-img-grayscale-hover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div class="grid sm:grid-cols-2 gap-6 mt-6">
              <SJCard elevated padding="8">
                <h3 class="font-semibold text-neutral-900 dark:text-white">Envíos</h3>
                <p class="text-sm sm:text-base text-neutral-600 dark:text-white/70 mt-2">
                  Entrega rápida y segura según disponibilidad.
                </p>
              </SJCard>
              <SJCard elevated padding="8">
                <h3 class="font-semibold text-neutral-900 dark:text-white">Soporte</h3>
                <p class="text-sm sm:text-base text-neutral-600 dark:text-white/70 mt-2">
                  Atención al cliente y asesoría de compra.
                </p>
              </SJCard>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Destacados -->
    <section class="py-16 sm:py-20 lg:py-24 bg-neutral-950 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <h2 class="font-display font-bold text-3xl sm:text-4xl">
            Eleva el estándar de tu cocina
          </h2>
          <p class="text-white/65 mt-3 text-base sm:text-lg">
            Nuestros productos robustos y confiables, brindan soluciones de vanguardia que mejoran tu estilo de vida.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          <a
            v-for="p in featured"
            :key="p.id"
            :href="productHref(p)"
            class="group block focus:outline-none"
          >
            <div class="bg-white border border-white/10 overflow-hidden">
              <div class="aspect-[16/9] flex items-center justify-center">
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

        <div class="mt-10 text-center">
          <a
            class="btn btn-outline border-white/25 text-white hover:bg-white/10 active:bg-white/15"
            href="#/productos"
          >
            Ver todo
          </a>
        </div>
      </div>
    </section>

    <!-- Últimos posts -->
    <section class="py-16 sm:py-20 lg:py-24 bg-neutral-50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between gap-6">
          <div>
            <h2 class="font-display font-bold text-3xl sm:text-4xl text-neutral-900 dark:text-white">Últimos posts</h2>
            <p class="text-neutral-600 dark:text-white/70 mt-2 text-base sm:text-lg">Lo más reciente.</p>
          </div>
          <a
            class="text-sm font-semibold text-brand-primary-700 dark:text-brand-primary-300 hover:text-brand-primary-800 dark:hover:text-brand-primary-200 transition-colors"
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
            <div class="bg-white dark:bg-neutral-950/35 border border-neutral-900/10 dark:border-white/10 overflow-hidden">
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
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import SJCard from '../components/SJCard.vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'
import { publicAssetUrl } from '../utils/publicAssetUrl'
import fallbackPosts from '../data/fallback-posts.json'

const srcFor = (filename) => publicAssetUrl(filename)
const imgSrc = (value) => publicAssetUrl(value)

// Fondos: usamos banners existentes (publicDir = imagen/), ya con producto + “ambiente”.
// Puedes cambiar el orden/selección cuando quieras.
const heroBackgrounds = computed(() => [
  srcFor('banner 2026-02-07 at 15.10.29.png'),
  srcFor('banner 2026-02-07 at 15.09.20.png'),
  srcFor('banner 2026-02-07 at 15.14.55.png'),
  srcFor('banner 2026-02-07 at 15.16.21.png'),
  srcFor('banner 2026-02-07 at 15.11.01.png')
])

const heroPostBackgrounds = computed(() => heroBackgrounds.value.slice(0, 3))

const contentImage = computed(() => heroBackgrounds.value[1] ?? heroBackgrounds.value[0])

const placeholderFeatured = [
  { id: 1, slug: null, name: 'Nevera SJ (demo)', category: 'refrigeradores', image: null },
  { id: 2, slug: null, name: 'Campana de cocina (demo)', category: 'campanas', image: null },
  { id: 3, slug: null, name: 'Horno eléctrico (demo)', category: 'hornos', image: null },
  { id: 4, slug: null, name: 'Vinera (demo)', category: 'vineras', image: null }
]

const featured = ref(placeholderFeatured)
const latestPosts = ref([])

const humanizeSlug = (id) => {
  if (!id) return '—'
  const s = String(id).replaceAll('-', ' ').trim()
  if (!s) return '—'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const categoryLabel = (slug) => humanizeSlug(slug)

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

const formatDateEs = (iso) => {
  try {
    if (!iso) return ''
    const d = new Date(String(iso))
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('es-DO', { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
  } catch {
    return ''
  }
}

const heroPostSlides = computed(() => {
  const list = Array.isArray(latestPosts.value) ? latestPosts.value : []
  const slides = list.slice(0, 3).map((p) => ({
    eyebrow: 'SJ Electronics',
    dateLabel: formatDateEs(p?.date),
    title: p?.title || 'Post',
    subtitle: p?.excerpt || '',
    href: postHref(p),
  }))
  // fallback si todavía no cargan
  if (slides.length) return slides
  return [
    {
      eyebrow: 'SJ Electronics',
      dateLabel: '',
      title: 'Minimalismo cálido para tu hogar',
      subtitle: 'Tecnología y electrodomésticos con asesoría clara, entregas seguras y soporte cercano.',
      href: '#/posts',
    },
  ]
})

onMounted(async () => {
  try {
    const r = await fetch('/api/wp-products.php', { headers: { Accept: 'application/json' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const payload = await r.json()
    if (!payload?.ok || !Array.isArray(payload.products)) throw new Error('Payload inválido')

    const list = payload.products
      .map((p, idx) => ({
        id: p?.id ?? `wp-${idx}`,
        slug: p?.slug ?? null,
        name: p?.name ?? 'Producto',
        category: p?.category ?? null,
        image: p?.image ?? null,
      }))
      .slice(0, 8)

    if (list.length) featured.value = list
  } catch {
    // Mantener placeholder silencioso.
    featured.value = placeholderFeatured
  }

  try {
    const r = await fetch('/api/wp-posts.php?per_page=3', { headers: { Accept: 'application/json' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const payload = await r.json()
    if (!payload?.ok || !Array.isArray(payload.posts)) throw new Error('Payload inválido')
    latestPosts.value = payload.posts
  } catch {
    latestPosts.value = (fallbackPosts.posts || []).slice(0, 3)
  }
})
</script>

