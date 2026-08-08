<template>
  <div class="bg-white dark:bg-sj-black text-neutral-900 dark:text-white">
    <section>
      <div class="max-w-[70ch] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-10 sm:pb-20">
        <a
          href="#/posts"
          class="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition mb-8"
        >
          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Volver a posts
        </a>

        <p v-if="isFallback && post" class="mb-6 text-xs font-medium text-neutral-500 dark:text-white/45 border border-neutral-200 dark:border-white/10 px-3 py-2 inline-block">
          Mostrando artículo de demostración.
        </p>
        <div v-if="error" class="border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 mb-6">
          <p class="text-sm text-neutral-700 dark:text-white/70">{{ error }}</p>
        </div>

        <header>
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <span v-if="post?.category" class="text-brand-primary-600 dark:text-brand-primary-400">{{ post.category }}</span>
            <span v-if="post?.category && post?.date" class="text-neutral-300 dark:text-white/25">·</span>
            <span v-if="post?.date" class="text-neutral-500 dark:text-white/50 font-medium normal-case tracking-normal">{{ prettyDate(post.date) }}</span>
            <span v-if="post?.readingMinutes" class="text-neutral-300 dark:text-white/25">·</span>
            <span v-if="post?.readingMinutes" class="text-neutral-500 dark:text-white/50 font-medium normal-case tracking-normal">{{ post.readingMinutes }} min de lectura</span>
          </div>
          <h1 class="mt-3 font-display font-bold text-3xl sm:text-4xl leading-tight">
            {{ post?.title || (isLoading ? 'Cargando…' : 'Post') }}
          </h1>
          <p v-if="post?.excerpt" class="mt-4 text-lg text-neutral-600 dark:text-white/70 leading-relaxed">
            {{ post.excerpt }}
          </p>
        </header>

        <div v-if="coverImage" class="mt-8 border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 overflow-hidden">
          <div class="aspect-[16/9]">
            <img :src="coverImage" :alt="post.title" class="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        </div>

        <div v-if="isLoading" class="mt-8 text-sm text-neutral-600 dark:text-white/55">
          Cargando post…
        </div>

        <article
          v-else
          class="prose prose-neutral max-w-none dark:prose-invert mt-10 text-[17px] leading-[1.75] prose-headings:font-display prose-a:text-brand-primary-700 dark:prose-a:text-brand-primary-400"
          v-html="safeHtml"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'
import { usePost, imgSrc } from '../composables/useCatalogSource'
import { usePageMeta, useJsonLd } from '../composables/usePageMeta'

const { fullPath } = useHashRoute()

const postId = computed(() => {
  try {
    const fp = String(fullPath.value || '')
    const queryPart = fp.split('?')[1] || ''
    const params = new URLSearchParams(queryPart)
    const id = params.get('id')
    const n = Number(id)
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
})

const postSlug = computed(() => {
  try {
    const fp = String(fullPath.value || '')
    const pathPart = fp.split('?')[0] || ''
    const segs = pathPart.split('/').filter(Boolean)
    if (segs[0] !== 'post') return null
    const slug = segs[1] ? decodeURIComponent(segs[1]) : ''
    return slug || null
  } catch {
    return null
  }
})

const { post, isLoading, isFallback, error } = usePost(postId, postSlug)

usePageMeta({
  title: computed(() => post.value?.title),
  description: computed(() => post.value?.excerpt),
  image: computed(() => imgSrc(post.value?.image)),
  path: computed(() => (post.value?.slug ? `/post/${post.value.slug}` : '/posts')),
  type: 'article',
})

useJsonLd('jsonld-article', computed(() => {
  if (!post.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.value.title,
    description: post.value.excerpt || undefined,
    image: imgSrc(post.value.image) || undefined,
    datePublished: post.value.date || undefined,
    author: { '@type': 'Organization', name: 'SJ Electronics' },
    publisher: { '@type': 'Organization', name: 'SJ Electronics' },
  }
}))

const prettyDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return iso
  }
}

const sanitizeHtml = (html) => {
  let s = String(html || '')
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  s = s.replace(/\son\w+="[^"]*"/gi, '')
  s = s.replace(/\son\w+='[^']*'/gi, '')
  s = s.replace(/javascript:/gi, '')
  return s
}

const safeHtml = computed(() => sanitizeHtml(post.value?.contentHtml || ''))
const coverImage = computed(() => imgSrc(post.value?.image))
</script>

<style scoped>
/* No hay plugin @tailwindcss/typography instalado: damos jerarquía básica de lectura a mano. */
.prose :deep(p) {
  margin: 1.1em 0;
}

.prose :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.75em;
  margin-bottom: 0.6em;
}

.prose :deep(h3) {
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 1.6em;
  margin-bottom: 0.5em;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin: 1.1em 0;
  padding-left: 1.4em;
}

.prose :deep(li) {
  margin: 0.4em 0;
}

.prose :deep(li) {
  list-style: disc;
}

.prose :deep(blockquote) {
  border-left: 3px solid currentColor;
  opacity: 0.85;
  padding-left: 1em;
  font-style: italic;
  margin: 1.5em 0;
}

.prose :deep(strong) {
  font-weight: 700;
}

.prose :deep(img) {
  max-width: 100%;
  height: auto;
}

/* Algunos contenidos traen estilos inline (ej. color negro) que rompen el modo oscuro. */
.prose :deep([style*="color:"]),
.prose :deep([style*="color :"]),
.prose :deep(font[color]) {
  color: inherit !important;
}

/* Compat Gutenberg (editor de bloques) */
.prose :deep(.wp-block-columns) {
  display: flex;
  gap: 1.75rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.prose :deep(.wp-block-column) {
  flex: 1 1 0;
  min-width: 0;
}

@media (max-width: 640px) {
  .prose :deep(.wp-block-columns) {
    flex-direction: column;
  }
}

.prose :deep(figure.wp-block-image) {
  margin: 1.5rem 0;
}

.prose :deep(figure.wp-block-image.aligncenter) {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.prose :deep(figure.wp-block-image.alignleft) {
  float: left;
  margin: 0.25rem 1.5rem 1rem 0;
}

.prose :deep(figure.wp-block-image.alignright) {
  float: right;
  margin: 0.25rem 0 1rem 1.5rem;
}

.prose :deep(.wp-block-image::after) {
  content: '';
  display: block;
  clear: both;
}
</style>
