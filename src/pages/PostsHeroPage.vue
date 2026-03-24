<template>
  <div class="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
    <SJHeroSlideshow
      eyebrow="SJ Electronics"
      title="Novedades y consejos"
      subtitle="Noticias, lanzamientos y guías rápidas para elegir mejor."
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

    <section class="py-16 sm:py-20 lg:py-24 bg-neutral-50 dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between gap-6">
          <div>
            <h2 class="font-display font-bold text-3xl sm:text-4xl text-neutral-900 dark:text-white">Últimos posts</h2>
            <p class="text-neutral-600 dark:text-white/65 mt-2 text-base sm:text-lg">Contenido reciente.</p>
          </div>
          <a class="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition dark:text-white/80 dark:hover:text-white" href="#/">
            Volver al inicio
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <a
            v-for="p in posts"
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

        <div v-if="error" class="mt-8 text-sm text-neutral-600 dark:text-white/60">
          {{ error }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'

const srcFor = (filename) => `/${encodeURI(String(filename))}`
const imgSrc = (value) => {
  if (!value) return null
  const s = String(value)
  if (/^https?:\/\//i.test(s)) return s
  return `/${encodeURI(s)}`
}

const heroBackgrounds = computed(() => [
  srcFor('banner 2026-02-07 at 15.10.29.png'),
  srcFor('banner 2026-02-07 at 15.09.20.png'),
  srcFor('banner 2026-02-07 at 15.14.55.png'),
  srcFor('banner 2026-02-07 at 15.16.21.png'),
  srcFor('banner 2026-02-07 at 15.11.01.png')
])

const posts = ref([])
const error = ref('')

const postHref = (p) => {
  const slug = p?.slug
  const id = p?.id
  if (slug) return `#/post/${encodeURIComponent(String(slug))}`
  return `#/post?id=${encodeURIComponent(String(id ?? ''))}`
}

onMounted(async () => {
  error.value = ''
  try {
    const r = await fetch('/api/wp-posts.php?per_page=12', { headers: { Accept: 'application/json' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const payload = await r.json()
    if (!payload?.ok || !Array.isArray(payload.posts)) throw new Error('Payload inválido')
    posts.value = payload.posts
  } catch (e) {
    error.value = `No pudimos cargar los posts. (${e?.message ?? 'Error desconocido'})`
    posts.value = []
  }
})
</script>

