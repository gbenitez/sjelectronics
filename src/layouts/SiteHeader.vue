<template>
  <header class="sj-sticky-header bg-white/90 dark:bg-sj-black/85 backdrop-blur border-b border-neutral-200 dark:border-white/10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white dark:bg-sj-black px-3 py-2 text-sm font-semibold text-neutral-900 dark:text-white ring-2 ring-brand-primary-500/60"
      >
        Saltar al contenido
      </a>
      <div class="flex items-center justify-between gap-4">
        <a href="#/" class="flex items-center gap-3 min-w-0">
          <img
            :src="isDark ? logoWhite : logoRed"
            alt="SJ Electronics - Más cerca de ti"
            class="h-10 w-auto min-w-[100px] shrink-0 sm:h-12 sm:min-w-[120px]"
            loading="eager"
          />
        </a>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-7">
          <a
            v-for="item in nav"
            :key="item.to"
            :href="`#${item.to}`"
            class="relative py-1 text-sm font-semibold uppercase tracking-wide text-neutral-600 dark:text-white/75 hover:text-neutral-900 dark:hover:text-white transition-colors"
            :class="item.to === selected ? 'text-neutral-900 dark:text-white' : ''"
            :aria-current="item.to === selected ? 'page' : undefined"
          >
            {{ item.label }}
            <span
              class="absolute -bottom-1 left-0 h-0.5 bg-brand-primary-600 transition-all"
              :class="item.to === selected ? 'w-full' : 'w-0'"
            />
          </a>
        </nav>

        <div class="flex items-center gap-2">
          <!-- Theme toggle: icónico, sol/luna -->
          <button
            type="button"
            class="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 dark:border-white/15 text-neutral-700 dark:text-white/80 hover:bg-neutral-100 dark:hover:bg-white/10 transition focus-ring"
            role="switch"
            :aria-checked="isDark"
            aria-label="Cambiar a modo claro/oscuro"
            @click="toggleTheme"
          >
            <svg v-if="isDark" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7" />
              <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5">
              <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
            </svg>
          </button>

          <!-- Mobile: abrir drawer -->
          <button
            type="button"
            class="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 dark:border-white/15 text-neutral-800 dark:text-white/85 hover:bg-neutral-100 dark:hover:bg-white/10 transition focus-ring"
            aria-label="Abrir menú"
            aria-haspopup="dialog"
            :aria-expanded="drawerOpen"
            @click="drawerOpen = true"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <SJMobileDrawer v-model="drawerOpen">
      <ul class="space-y-1">
        <li v-for="item in nav" :key="item.to">
          <a
            :href="`#${item.to}`"
            class="flex items-center justify-between py-4 text-2xl font-display font-bold border-b border-white/10 focus-ring"
            :class="item.to === selected ? 'text-brand-primary-500' : 'text-white'"
            :aria-current="item.to === selected ? 'page' : undefined"
            @click="drawerOpen = false"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <template #footer>
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-md border border-white/15 px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/5 transition focus-ring"
          role="switch"
          :aria-checked="isDark"
          @click="toggleTheme"
        >
          <span>{{ isDark ? 'Modo oscuro' : 'Modo claro' }}</span>
          <svg v-if="isDark" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7" />
            <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5">
            <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          </svg>
        </button>
      </template>
    </SJMobileDrawer>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'
import SJMobileDrawer from '../components/SJMobileDrawer.vue'
// `imagen/` es `publicDir`, así que se sirve desde la raíz y NO se debe importar.
const logoRed = `/${encodeURI('Logotipo-Red-sin-fondo.png')}`
const logoWhite = `/${encodeURI('Logotipo-white-sin-fondo (1).png')}`

const drawerOpen = ref(false)

const isDark = ref(false)

const applyThemeClass = (dark) => {
  const root = document.documentElement
  if (dark) root.classList.add('dark')
  else root.classList.remove('dark')
}

const setTheme = (dark) => {
  isDark.value = !!dark
  applyThemeClass(isDark.value)
  try {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  } catch {}
}

const toggleTheme = () => setTheme(!isDark.value)

onMounted(() => {
  let initial = null
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') initial = true
    if (stored === 'light') initial = false
  } catch {}
  if (initial === null) {
    initial = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
  }
  setTheme(initial)
})

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/quienes-somos', label: 'Quiénes somos' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/posts', label: 'Posts' },
 // { to: '/componentes', label: 'Componentes' }
]

const { path } = useHashRoute()

const selected = computed(() => {
  const p = String(path.value || '/')
  if (p === '/') return '/'
  const first = p.split('/').filter(Boolean)[0]
  const key = first ? `/${first}` : '/'
  return nav.find((n) => n.to === key)?.to ?? '/'
})
</script>

