<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <SiteHeader />
    <main id="main-content" class="min-h-[calc(100vh-140px)]">
      <component :is="CurrentPage" :key="fullPath" />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SiteHeader from './layouts/SiteHeader.vue'
import SiteFooter from './layouts/SiteFooter.vue'

import HomeHeroPage from './pages/HomeHeroPage.vue'
import ProductsPage from './pages/ProductsPage.vue'
import ProductDetailPage from './pages/ProductDetailPage.vue'
import PostsHeroPage from './pages/PostsHeroPage.vue'
import PostDetailPage from './pages/PostDetailPage.vue'
import AboutPage from './pages/AboutPage.vue'
import ContactPage from './pages/ContactPage.vue'
import ComponentsPage from './pages/ComponentsPage.vue'
import { useHashRoute } from './composables/useHashRoute'

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
</script>

<style scoped></style>
