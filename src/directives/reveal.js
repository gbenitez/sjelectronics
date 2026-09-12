/**
 * v-reveal — revela un bloque cuando entra en el viewport.
 *
 * Uso:
 *   v-reveal                → sube y aparece
 *   v-reveal.mask           → se descubre de abajo hacia arriba (borde duro, sin fade)
 *   v-reveal.left/.right    → entra lateralmente
 *   v-reveal.stagger        → no anima el contenedor: anima sus hijos en cascada
 *   v-reveal="160"          → retardo extra en ms
 *
 * Con `prefers-reduced-motion: reduce` no se aplica ninguna clase: el contenido
 * queda visible desde el primer frame, sin estado inicial oculto.
 */

const BASE = 'sj-reveal'
const GROUP = 'sj-reveal-group'
const VISIBLE = 'sj-reveal-in'
const VARIANTS = ['mask', 'left', 'right']

let observer = null

const indexChildren = (el) => {
  Array.from(el.children).forEach((child, i) => {
    child.style.setProperty('--sj-reveal-i', String(i))
  })
}

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

const getObserver = () => {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add(VISIBLE)
        // Una sola vez: al volver a subir el bloque no se vuelve a ocultar.
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

export const reveal = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return

    const variant = VARIANTS.find((v) => binding.modifiers[v]) || 'rise'
    el.classList.add(`${BASE}--${variant}`)

    const delay = Number(binding.value)
    if (Number.isFinite(delay) && delay > 0) el.style.setProperty('--sj-reveal-delay', `${delay}ms`)

    if (binding.modifiers.stagger) {
      el.classList.add(GROUP)
      indexChildren(el)
    } else {
      el.classList.add(BASE)
    }

    getObserver().observe(el)
  },

  // Las rejillas de productos y posts se llenan con datos asíncronos: reindexamos
  // para que la cascada exista también cuando los hijos llegan después del mount.
  updated(el, binding) {
    if (binding.modifiers.stagger && el.classList.contains(GROUP)) indexChildren(el)
  },

  unmounted(el) {
    observer?.unobserve(el)
  },
}

export default reveal
