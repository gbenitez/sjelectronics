<template>
  <header class="sj-sticky-header bg-white/85 dark:bg-neutral-950/75 backdrop-blur border-b border-neutral-200 dark:border-white/10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white dark:bg-neutral-950 px-3 py-2 text-sm font-semibold text-neutral-900 dark:text-white ring-2 ring-brand-secondary-500/50"
      >
        Saltar al contenido
      </a>
      <div class="flex items-center justify-between gap-4">
        <a href="#/" class="flex items-center gap-3 min-w-0">
          <img
            :src="isDark ? logoWhite : logoRed"
            alt="SJ Electronics - Más cerca de ti"
            class="h-10 w-auto sm:h-12"
            loading="eager"
          />
     
        </a>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-6">
          <a
            v-for="item in nav"
            :key="item.to"
            :href="`#${item.to}`"
            class="text-sm font-semibold text-neutral-600 dark:text-white/80 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
            :class="item.to === selected ? 'text-brand-primary-700 dark:text-brand-primary-300' : ''"
            :aria-current="item.to === selected ? 'page' : undefined"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- Theme toggle -->
        <div class="hidden sm:flex items-center gap-3">
          <label class="inline-flex items-center gap-2 cursor-pointer select-none">
            <span class="text-xs font-semibold text-neutral-600 dark:text-white/70">Claro</span>
            <input
              type="checkbox"
              class="sr-only"
              :checked="isDark"
              @change="toggleTheme"
              aria-label="Cambiar tema claro/oscuro"
              role="switch"
              :aria-checked="isDark"
            />
            <span
              class="relative inline-flex h-6 w-11 items-center rounded-pill border border-neutral-300 dark:border-white/15 bg-white dark:bg-white/10 transition"
            >
              <span
                class="inline-block h-5 w-5 transform rounded-pill bg-neutral-900 dark:bg-white transition"
                :class="isDark ? 'translate-x-5' : 'translate-x-1'"
              />
            </span>
            <span class="text-xs font-semibold text-neutral-600 dark:text-white/70">Oscuro</span>
          </label>
        </div>

        <!-- Mobile / Tablet nav -->
        <div class="md:hidden">
          <label class="sr-only" for="main-jump">Ir a</label>
          <select
            id="main-jump"
            class="w-full min-h-[44px] px-3 py-2.5 rounded-md border bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border-neutral-200 dark:border-white/10 focus:outline-none focus:ring-3 focus:ring-brand-secondary-500/35 focus:ring-offset-2"
            :value="selected"
            @change="go($event.target.value)"
          >
            <option v-for="item in nav" :key="item.to" :value="item.to">
              {{ item.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useHashRoute } from '../composables/useHashRoute'
// `imagen/` es `publicDir`, así que se sirve desde la raíz y NO se debe importar.
const logoRed = `/${encodeURI('Logotipo-Red-sin-fondo.png')}`
const logoWhite = `/${encodeURI('Logotipo-white-sin-fondo (1).png')}`

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

const { path, setPath } = useHashRoute()

const selected = computed(() => {
  const p = String(path.value || '/')
  if (p === '/') return '/'
  const first = p.split('/').filter(Boolean)[0]
  const key = first ? `/${first}` : '/'
  return nav.find((n) => n.to === key)?.to ?? '/'
})

const go = (to) => {
  setPath(to)
}
</script>

