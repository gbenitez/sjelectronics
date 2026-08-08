<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <SiteHeader />
    <main id="main-content" class="min-h-[calc(100vh-140px)]">
      <component :is="CurrentPage" :key="fullPath" />
    </main>
    <SiteFooter />
    <SJWhatsAppButton />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, watch } from 'vue'
import SiteHeader from './layouts/SiteHeader.vue'
import SiteFooter from './layouts/SiteFooter.vue'
import SJWhatsAppButton from './components/SJWhatsAppButton.vue'
// Home se carga de forma directa: es la ruta de entrada más probable.
import HomeHeroPage from './pages/HomeHeroPage.vue'
import { useHashRoute } from './composables/useHashRoute'

// Resto de páginas con code splitting por ruta (chunk propio vía Vite/Rollup).
const ProductsPage = defineAsyncComponent(() => import('./pages/ProductsPage.vue'))
const ProductDetailPage = defineAsyncComponent(() => import('./pages/ProductDetailPage.vue'))
const PostsHeroPage = defineAsyncComponent(() => import('./pages/PostsHeroPage.vue'))
const PostDetailPage = defineAsyncComponent(() => import('./pages/PostDetailPage.vue'))
const AboutPage = defineAsyncComponent(() => import('./pages/AboutPage.vue'))
const ContactPage = defineAsyncComponent(() => import('./pages/ContactPage.vue'))
const ComponentsPage = defineAsyncComponent(() => import('./pages/ComponentsPage.vue'))

const pages = {
  '/': HomeHeroPage,
  '/productos': ProductsPage,
  '/producto': ProductDetailPage,
  '/posts': PostsHeroPage,
  '/post': PostDetailPage,
  '/quienes-somos': AboutPage,
  '/contacto': ContactPage,
  '/componentes': ComponentsPage
}

const { path, fullPath } = useHashRoute()

const routeKey = computed(() => {
  const p = String(path.value || '/')
  if (p === '/') return '/'
  const first = p.split('/').filter(Boolean)[0]
  return first ? `/${first}` : '/'
})

const CurrentPage = computed(() => pages[routeKey.value] ?? HomeHeroPage)

watch(routeKey, () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
})
</script>

<style scoped></style>
