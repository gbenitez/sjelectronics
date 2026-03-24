import { onBeforeUnmount, onMounted, ref } from 'vue'

const getPathFromHash = () => {
  const h = window.location.hash || '#/'
  const p = h.startsWith('#') ? h.slice(1) : h
  return p || '/'
}

const path = ref('/')
const fullPath = ref('/')
let listeners = 0
let isListening = false

const sync = () => {
  const fp = getPathFromHash()
  fullPath.value = fp
  // Normaliza: elimina query string para que el "router" por mapa funcione.
  path.value = String(fp).split('?')[0] || '/'
}

/**
 * Enrutado simple por hash (sin vue-router).
 * Mantiene `path` reactivo y sincronizado con `window.location.hash`.
 */
export function useHashRoute() {
  const setPath = (to) => {
    window.location.hash = `#${to || '/'}`
  }

  onMounted(() => {
    listeners += 1
    if (!isListening) {
      isListening = true
      sync()
      window.addEventListener('hashchange', sync)
    }
  })

  onBeforeUnmount(() => {
    listeners = Math.max(0, listeners - 1)
    if (isListening && listeners === 0) {
      isListening = false
      window.removeEventListener('hashchange', sync)
    }
  })

  return { path, fullPath, setPath, sync }
}

