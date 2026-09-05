<template>
  <div class="bg-white dark:bg-sj-black text-neutral-900 dark:text-white">
    <SJHeroSlideshow
      eyebrow="SJ Electronics"
      title="Recetas y consejos"
      subtitle="Ideas rápidas, guías de uso y cuidado para sacarle el máximo provecho a tu equipo SJ."
      :backgrounds="heroBackgrounds"
      :interval-ms="4200"
    >
      <template #ctas>
        <a class="btn btn-primary" href="#/productos">Ver productos</a>
        <a class="btn btn-outline border-white/30 text-white hover:bg-white/10 active:bg-white/15" href="#/contacto">
          Hablar con ventas
        </a>
      </template>
    </SJHeroSlideshow>

    <section class="py-16 sm:py-20 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between gap-6">
          <div>
            <h2 class="font-display font-bold text-3xl sm:text-4xl">Últimos posts</h2>
            <p class="text-neutral-600 dark:text-white/65 mt-2 text-base sm:text-lg">Contenido reciente.</p>
          </div>
          <a class="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition dark:text-white/80 dark:hover:text-white" href="#/">
            Volver al inicio
          </a>
        </div>

        <p v-if="isFallback" class="mt-6 text-xs font-medium text-neutral-500 dark:text-white/45 border border-neutral-200 dark:border-white/10 px-3 py-2 inline-block">
          Mostrando artículos de demostración.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <a
            v-for="p in posts"
            :key="p.id"
            :href="postHref(p)"
            class="group block focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary-500/45"
          >
            <div class="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 overflow-hidden">
              <div class="aspect-[16/9] flex items-center justify-center">
                <img
                  v-if="imgSrc(p.image)"
                  :src="imgSrc(p.image)"
                  :alt="p.title"
                  class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
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

            <div class="mt-4">
              <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400">
                <span v-if="p.category">{{ p.category }}</span>
                <span v-if="p.category && p.date" class="text-neutral-300 dark:text-white/25">·</span>
                <span v-if="p.date" class="text-neutral-500 dark:text-white/45 font-medium normal-case tracking-normal">{{ formatDate(p.date) }}</span>
              </div>
              <div class="mt-2 text-base font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-2 group-hover:underline underline-offset-4">
                {{ p.title }}
              </div>
              <p v-if="p.excerpt" class="text-sm text-neutral-600 dark:text-white/60 mt-2 line-clamp-2">
                {{ p.excerpt }}
              </p>
              <p v-if="p.readingMinutes" class="text-xs text-neutral-500 dark:text-white/45 mt-3">
                {{ p.readingMinutes }} min de lectura
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'
import { usePostList, imgSrc } from '../composables/useCatalogSource'
import { usePageMeta } from '../composables/usePageMeta'

usePageMeta({
  title: 'Posts',
  description: 'Recetas, guías y consejos de cuidado para tus electrodomésticos SJ.',
  path: '/posts',
})

const srcFor = (filename) => imgSrc(filename)

const heroBackgrounds = computed(() => [
  srcFor('site/hero-desk-01.jpg'),
  srcFor('site/hero-desk-02.jpg'),
  srcFor('site/hero-mobile-01.jpg'),
  srcFor('site/hero-mobile-02.jpg'),
])

const { posts, isFallback } = usePostList(12)

const postHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/post/${encodeURIComponent(String(slug))}`
  return `#/post?id=${encodeURIComponent(String(id ?? ''))}`
}

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch {
    return ''
  }
}
</script>
