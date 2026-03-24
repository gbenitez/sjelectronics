<template>
  <div class="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
    <section class="bg-neutral-100 dark:bg-neutral-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-10 sm:pb-16">
        <div class="flex items-center justify-between gap-4 mb-8">
          <a
            href="#/posts"
            class="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Volver a posts
          </a>
        </div>

        <div v-if="error" class="rounded-lg border border-neutral-900/10 dark:border-white/10 bg-white dark:bg-neutral-950/40 p-5 mb-6">
          <p class="text-sm text-neutral-700 dark:text-white/70">{{ error }}</p>
        </div>

        <header>
          <p v-if="post?.date" class="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-white/60">
            {{ prettyDate(post.date) }}
          </p>
          <h1 class="mt-2 font-display font-bold text-3xl sm:text-4xl leading-tight">
            {{ post?.title || 'Cargando…' }}
          </h1>
          <p v-if="post?.excerpt" class="mt-4 text-lg text-neutral-600 dark:text-white/70">
            {{ post.excerpt }}
          </p>
        </header>

        <div v-if="post?.image" class="mt-8 border border-neutral-900/10 dark:border-white/10 bg-white dark:bg-neutral-950/30 overflow-hidden">
          <div class="aspect-[16/9]">
            <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        </div>

        <div v-if="isLoading" class="mt-8 text-sm text-neutral-600 dark:text-white/55">
          Cargando post…
        </div>

        <article
          v-else
          class="prose prose-neutral max-w-none dark:prose-invert mt-10 prose-a:text-brand-primary-700 dark:prose-a:text-brand-primary-300"
          v-html="safeHtml"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'

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

const post = ref(null)
const isLoading = ref(true)
const error = ref('')

const prettyDate = (iso) => {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return iso
  }
}

const sanitizeHtml = (html) => {
  // Sanitizado básico (no perfecto). Para máxima seguridad, usar sanitizer robusto.
  let s = String(html || '')
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  s = s.replace(/\son\w+="[^"]*"/gi, '')
  s = s.replace(/\son\w+='[^']*'/gi, '')
  s = s.replace(/javascript:/gi, '')
  return s
}

const safeHtml = computed(() => sanitizeHtml(post.value?.contentHtml || ''))

async function load() {
  isLoading.value = true
  error.value = ''
  post.value = null

  if (!postId.value && !postSlug.value) {
    error.value = 'Post inválido o sin identificador.'
    isLoading.value = false
    return
  }

  try {
    const qs = postId.value ? `id=${encodeURIComponent(String(postId.value))}` : `slug=${encodeURIComponent(String(postSlug.value))}`
    const r = await fetch(`/api/wp-post.php?${qs}`, { headers: { Accept: 'application/json' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const payload = await r.json()
    if (!payload?.ok || !payload.post) throw new Error('Payload inválido')
    post.value = payload.post
  } catch (e) {
    error.value = `No pudimos cargar el post. (${e?.message ?? 'Error desconocido'})`
  } finally {
    isLoading.value = false
  }
}

watch([postId, postSlug], load, { immediate: true })
</script>

<style scoped>
/* Prose en dark ya está manejado por clases; esto es solo para asegurar imágenes responsivas */
.prose :deep(img) {
  max-width: 100%;
  height: auto;
}

/* Algunos contenidos traen estilos inline (ej. color negro) que rompen el modo oscuro.
   Forzamos a heredar color para mantener legibilidad. */
.prose :deep([style*="color:"]),
.prose :deep([style*="color :"]),
.prose :deep(font[color]) {
  color: inherit !important;
}

/* Compat Gutenberg (editor de bloques) */
.prose :deep(.wp-block-columns) {
  display: flex;
  gap: 1.75rem; /* similar al spacing de WP */
  align-items: flex-start;
  flex-wrap: wrap;
}

.prose :deep(.wp-block-column) {
  flex: 1 1 0;
  min-width: 0;
}

/* En mobile, columnas apiladas (WP hace algo parecido) */
@media (max-width: 640px) {
  .prose :deep(.wp-block-columns) {
    flex-direction: column;
  }
}

/* Imágenes con clases típicas de WP */
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

/* Limpieza de floats para que no rompa el layout */
.prose :deep(.wp-block-image::after) {
  content: '';
  display: block;
  clear: both;
}
</style>

