/**
 * Capa de datos única para el catálogo: decide API (WordPress vía proxy PHP) vs mock local,
 * normaliza ambos orígenes a la misma forma y expone el mismo contrato a cualquier página.
 * Nunca expone el origen a la UI más allá de `isFallback` (para el aviso discreto de demo).
 */
import { computed, ref, watch } from 'vue'
import fallbackCatalog from '../data/fallback-catalog.json'
import fallbackPosts from '../data/fallback-posts.json'
import { publicAssetUrl } from '../utils/publicAssetUrl'

const TIMEOUT_MS = 5000
const RETRIES = 1

/** Orden de categorías: se toma tal cual del catálogo (JSON local o respuesta de WordPress). */
export const CATEGORY_ORDER = (fallbackCatalog.categories || []).map((c) => c.slug)

// Sin alias: cada slug del catálogo es su propia categoría. Se mantiene el objeto (vacío)
// para no romper importaciones existentes de normalizeCategory.
const CATEGORY_ALIASES = {}

const DEFAULT_ICON = 'M4 7h16M4 12h16M4 17h10'

const CATEGORY_ICONS = {
  'air-fryers': 'M6 10h12a1 1 0 0 1 1 1v2a7 7 0 0 1-14 0v-2a1 1 0 0 1 1-1Zm1-4h10M9 6V4h6v2',
  'freidoras-aire': 'M6 10h12a1 1 0 0 1 1 1v2a7 7 0 0 1-14 0v-2a1 1 0 0 1 1-1Zm1-4h10M9 6V4h6v2',
  sandwicheras: 'M4 9h16v3H4V9Zm0 3v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3M8 6l2 3m6-3-2 3',
  parrillas: 'M4 10h16v5H4v-5Zm2 5v2m12-2v2M4 10l2-4h12l2 4',
  'plancha-grill': 'M4 10h16v5H4v-5Zm2 5v2m12-2v2M4 10l2-4h12l2 4',
  ollas: 'M6 11h12v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5Zm-2 0h16M9 11V8a3 3 0 0 1 6 0v3',
  'olla-presion': 'M6 11h12v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5Zm-2 0h16M9 11V8a3 3 0 0 1 6 0v3',
  licuadoras: 'M10 3h4m-5 6h6l-1 12H10L9 9Zm1-3h4',
  repuestos: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z',
  neveras: 'M5 4h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 8h10M7 6v2M7 14v2',
  'neveras-ejecutivas': 'M5 4h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 8h10M7 6v2M7 14v2',
  freezer: 'M5 4h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 8h10M7 6v2M7 14v2',
  'congeladores-duales': 'M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm0 0 2-4h12l2 4',
  'exhibidor-horizontal': 'M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm0 0 2-4h12l2 4',
  'exhibidor-vertical': 'M6 3h12v18H6zM6 9h12M9 3v6',
  'exhibidor-vertical-congelador': 'M6 3h12v18H6zM6 9h12M9 3v6',
  cocinas: 'M4 10h16v5H4v-5Zm2 5v2m12-2v2M4 10l2-4h12l2 4',
  microondas: 'M4 6h16v12H4zM8 8h8v8H8zM17 10v4',
  cafeteras: 'M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm12 2h2a2 2 0 0 1 0 4h-2M8 4v2m4-2v2',
  batidoras: 'M10 3h4m-5 6h6l-1 12H10L9 9Zm1-3h4',
  picatodo: 'M6 6h12l-1 12H7L6 6Zm3 0V4h6v2',
  'exprimidor-jugo': 'M6 6h12l-1 12H7L6 6Zm3 0V4h6v2',
  planchas: 'M4 18h16M6 18l1-9a2 2 0 0 1 2-2h6l4 5v6H6Z',
  'lavadoras-semi-automaticas': 'M5 4h14v16H5zM12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 6h.01M11 6h.01',
  'lavadoras-automaticas': 'M5 4h14v16H5zM12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 6h.01M11 6h.01',
  'secadora-automaticas': 'M5 4h14v16H5zM12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 6h.01M11 6h.01',
  'aire-ventana': 'M4 9h16v6H4zM7 15v2m10-2v2M4 9l2-3h12l2 3',
  'aire-split': 'M4 9h16v3H4zM6 12v2m4-2v2m4-2v2m4-2v2',
  'aire-tipo-techo': 'M4 9h16v3H4zM6 12v2m4-2v2m4-2v2m4-2v2',
  'ventiladores-pedestal': 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 3v3M12 18v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1',
  'ventiladores-recargables': 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 3v3M12 18v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1',
  'ventiladores-piso': 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 3v3M12 18v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1',
  'dispensadores-agua': 'M8 3h8l1 6a5 5 0 0 1-10 0l1-6ZM6 21h12M9 15v6m6-6v6',
  televisores: 'M4 5h16v10H4zM9 19h6M12 15v4',
  'altavoces-portatiles': 'M6 4h12v16H6zM12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM9 6h6',
  'protector-voltaje': 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
}

const humanizeSlug = (id) => {
  if (!id) return '—'
  const s = String(id).replaceAll('-', ' ').trim()
  if (!s) return '—'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const normalizeCategory = (v) => {
  const s = v == null ? null : String(v)
  if (!s) return null
  return CATEGORY_ALIASES[s] ?? s
}

export const categoryIcon = (id) => CATEGORY_ICONS[id] || DEFAULT_ICON

export const defaultCategoryLabel = (id) => humanizeSlug(id)

/** fetch con timeout + 1 reintento. Nunca lanza por AbortError silencioso: propaga para que el caller haga fallback. */
async function fetchJson(url, { timeoutMs = TIMEOUT_MS, retries = RETRIES } = {}) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal })
      clearTimeout(timer)
      if (!res.ok) {
        // 401/403 no es "API caída": es un problema de permisos/config que el fallback
        // silencioso puede esconder indefinidamente. Se distingue para poder monitorearlo
        // (p.ej. alguien restringió la REST API de WordPress o un WAF empezó a bloquear al proxy).
        if (res.status === 401 || res.status === 403) {
          console.warn(`[useCatalogSource] ${url} respondió ${res.status} (auth/permisos). Mostrando fallback local.`)
        }
        throw new Error(`HTTP ${res.status}`)
      }
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) throw new Error('Respuesta no JSON')
      return await res.json()
    } catch (e) {
      clearTimeout(timer)
      lastError = e
    }
  }
  throw lastError
}

const mapListItem = (p, idx) => ({
  id: p?.id ?? `fb-${idx}`,
  slug: p?.slug ?? null,
  name: p?.name ?? 'Producto',
  model: p?.model ?? null,
  category: normalizeCategory(p?.category ?? null),
  categoryName: p?.categoryName ?? null,
  image: p?.image ?? null,
  excerpt: p?.excerpt ?? null,
})

const fallbackList = () => (fallbackCatalog.products || []).map(mapListItem)

const fallbackCategories = () =>
  (fallbackCatalog.categories || []).map((c) => ({
    id: c.slug,
    label: c.name || humanizeSlug(c.slug),
    icon: categoryIcon(c.slug),
  }))

export function categoryLabelFrom(categories, id) {
  return categories.value?.find?.((c) => c.id === id)?.label ?? humanizeSlug(id)
}

/**
 * Lista de productos + categorías (usada por Home y por el grid de Productos).
 */
export function useProductList() {
  const products = ref(fallbackList())
  const categories = ref(fallbackCategories())
  const isLoading = ref(true)
  const isFallback = ref(false)
  const error = ref('')

  const load = async () => {
    isLoading.value = true
    error.value = ''

    try {
      const payload = await fetchJson('/api/wp-product-categories.php')
      if (!payload?.ok || !Array.isArray(payload.categories)) throw new Error('Payload inválido')
      const list = payload.categories.filter((t) => t?.slug)
      categories.value = list.length
        ? list.map((t) => ({
            id: String(t.slug),
            label: String(t.name || humanizeSlug(t.slug)),
            icon: categoryIcon(String(t.slug)),
          }))
        : fallbackCategories()
    } catch {
      categories.value = fallbackCategories()
    }

    try {
      const payload = await fetchJson('/api/wp-products.php')
      if (!payload?.ok || !Array.isArray(payload.products)) throw new Error('Payload inválido')
      const list = payload.products.map(mapListItem)
      products.value = list.length ? list : fallbackList()
      isFallback.value = Boolean(payload.meta?.fallback) || list.length === 0
    } catch (e) {
      error.value = e?.message || 'No pudimos cargar productos.'
      products.value = fallbackList()
      isFallback.value = true
    } finally {
      isLoading.value = false
    }
  }

  load()

  return { products, categories, isLoading, isFallback, error }
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

const mapFallbackDetail = (raw) => {
  const cat = normalizeCategory(raw.category || null)
  const images = Array.isArray(raw.images) ? raw.images.filter(Boolean) : []
  const image = raw.image || images[0] || null
  const attributes = Array.isArray(raw.attributes)
    ? raw.attributes
        .filter((a) => a && typeof a.label === 'string' && typeof a.value === 'string')
        .map((a) => ({ key: a.key ?? null, label: a.label.trim(), value: a.value.trim() }))
    : []
  return {
    id: raw.id,
    slug: raw.slug ?? null,
    name: raw.name ?? 'Producto',
    model: raw.model ?? null,
    category: cat,
    categoryName: raw.categoryName ?? null,
    image,
    images: images.length ? images : image ? [image] : [],
    excerpt: raw.excerpt ?? null,
    descriptionHtml: raw.descriptionHtml ?? null,
    attributes,
    link: null,
    documents: { specSheet: null, manual: null, all: [] },
  }
}

/**
 * Producto individual (id o slug) + relacionados. Usado por el detalle de producto.
 */
export function useProduct(idRef, slugRef) {
  const product = ref(null)
  const related = ref([])
  const isLoading = ref(true)
  const isFallback = ref(false)
  const error = ref('')

  const load = async () => {
    const id = idRef?.value ?? null
    const slug = slugRef?.value ?? null

    isLoading.value = true
    error.value = ''
    product.value = null
    related.value = []
    isFallback.value = false

    if (!id && !slug) {
      error.value = 'Producto inválido.'
      isLoading.value = false
      return
    }

    try {
      const qs = id ? `id=${encodeURIComponent(String(id))}` : `slug=${encodeURIComponent(String(slug))}`
      const payload = await fetchJson(`/api/wp-product.php?${qs}`)
      if (!payload?.ok || !payload.product) throw new Error('Payload inválido')

      product.value = { ...payload.product, category: normalizeCategory(payload.product.category) }
      isFallback.value = Boolean(payload.meta?.fallback)

      try {
        const rel = await fetchJson('/api/wp-products.php')
        if (!rel?.ok || !Array.isArray(rel.products)) throw new Error('related payload')
        const cat = product.value.category
        const pid = product.value.id
        related.value = rel.products
          .map(mapListItem)
          .filter((x) => x.id !== pid && (!cat || x.category === cat))
          .slice(0, 8)
      } catch {
        related.value = []
      }
    } catch (e) {
      const raw = findFallbackProductRaw(id, slug)
      if (raw) {
        product.value = mapFallbackDetail(raw)
        isFallback.value = true
        const list = fallbackCatalog.products || []
        const cat = normalizeCategory(raw.category)
        related.value = list
          .filter((x) => x && x.id !== raw.id && (!cat || normalizeCategory(x.category) === cat))
          .map(mapListItem)
          .slice(0, 8)
      } else {
        error.value = e?.message || 'No pudimos cargar el producto.'
      }
    } finally {
      isLoading.value = false
    }
  }

  watch([() => idRef?.value, () => slugRef?.value], load, { immediate: true })

  return { product, related, isLoading, isFallback, error }
}

export const imgSrc = (value) => publicAssetUrl(value)

/** ~200 palabras/min. No inventa un dato preciso: es una estimación a partir del contenido real. */
export function estimateReadingMinutes(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

const mapPostListItem = (p, idx) => ({
  id: p?.id ?? `fb-${idx}`,
  slug: p?.slug ?? null,
  title: p?.title ?? 'Post',
  category: p?.category ?? null,
  excerpt: p?.excerpt ?? null,
  date: p?.date ?? null,
  image: p?.image ?? null,
  readingMinutes: p?.contentHtml ? estimateReadingMinutes(p.contentHtml) : null,
})

const fallbackPostList = () => (fallbackPosts.posts || []).map(mapPostListItem)

/**
 * Listado de posts (Home y Posts). Mismo contrato que useProductList.
 */
export function usePostList(perPage = 12) {
  const posts = ref(fallbackPostList())
  const isLoading = ref(true)
  const isFallback = ref(false)
  const error = ref('')

  const load = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const payload = await fetchJson(`/api/wp-posts.php?per_page=${encodeURIComponent(String(perPage))}`)
      if (!payload?.ok || !Array.isArray(payload.posts)) throw new Error('Payload inválido')
      const list = payload.posts.map(mapPostListItem)
      posts.value = list.length ? list : fallbackPostList()
      isFallback.value = Boolean(payload.meta?.fallback) || list.length === 0
    } catch (e) {
      error.value = e?.message || 'No pudimos cargar los posts.'
      posts.value = fallbackPostList()
      isFallback.value = true
    } finally {
      isLoading.value = false
    }
  }

  load()

  return { posts, isLoading, isFallback, error }
}

const findFallbackPostRaw = (id, slug) => {
  const list = fallbackPosts.posts || []
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

const mapFallbackPostDetail = (raw) => ({
  id: raw.id,
  slug: raw.slug ?? null,
  title: raw.title ?? 'Post',
  category: raw.category ?? null,
  excerpt: raw.excerpt ?? null,
  date: raw.date ?? null,
  image: raw.image ?? null,
  link: null,
  contentHtml: raw.contentHtml ?? null,
  readingMinutes: raw.contentHtml ? estimateReadingMinutes(raw.contentHtml) : null,
})

/**
 * Post individual (id o slug). Usado por el detalle de artículo.
 */
export function usePost(idRef, slugRef) {
  const post = ref(null)
  const isLoading = ref(true)
  const isFallback = ref(false)
  const error = ref('')

  const load = async () => {
    const id = idRef?.value ?? null
    const slug = slugRef?.value ?? null

    isLoading.value = true
    error.value = ''
    post.value = null
    isFallback.value = false

    if (!id && !slug) {
      error.value = 'Post inválido.'
      isLoading.value = false
      return
    }

    try {
      const qs = id ? `id=${encodeURIComponent(String(id))}` : `slug=${encodeURIComponent(String(slug))}`
      const payload = await fetchJson(`/api/wp-post.php?${qs}`)
      if (!payload?.ok || !payload.post) throw new Error('Payload inválido')
      post.value = {
        ...payload.post,
        readingMinutes: payload.post.contentHtml ? estimateReadingMinutes(payload.post.contentHtml) : null,
      }
      isFallback.value = Boolean(payload.meta?.fallback)
    } catch (e) {
      const raw = findFallbackPostRaw(id, slug)
      if (raw) {
        post.value = mapFallbackPostDetail(raw)
        isFallback.value = true
      } else {
        error.value = e?.message || 'No pudimos cargar el post.'
      }
    } finally {
      isLoading.value = false
    }
  }

  watch([() => idRef?.value, () => slugRef?.value], load, { immediate: true })

  return { post, isLoading, isFallback, error }
}
