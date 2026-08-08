<template>
  <Teleport to="body">
    <Transition name="sj-drawer-overlay">
      <div v-if="modelValue" class="fixed inset-0 z-50 md:hidden">
        <div class="absolute inset-0 bg-sj-black/80" @click="close" />

        <Transition name="sj-drawer-panel" appear>
          <div
            v-if="modelValue"
            ref="panelRef"
            class="absolute inset-y-0 right-0 w-full max-w-sm bg-sj-black text-white flex flex-col focus:outline-none"
            role="dialog"
            aria-modal="true"
            :aria-label="ariaLabel"
            @keydown="onKeydown"
          >
            <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Menú</span>
              <button
                ref="closeBtnRef"
                type="button"
                class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 hover:bg-white/10 active:bg-white/15 transition focus-ring"
                aria-label="Cerrar menú"
                @click="close"
              >
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <nav class="flex-1 overflow-y-auto px-5 py-6">
              <slot />
            </nav>

            <div v-if="$slots.footer" class="px-5 py-5 border-t border-white/10">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Menú de navegación' },
})

const emit = defineEmits(['update:modelValue'])

const panelRef = ref(null)
const closeBtnRef = ref(null)
let lastFocused = null

const close = () => emit('update:modelValue', false)

const getFocusable = () => {
  const root = panelRef.value
  if (!root) return []
  return Array.from(
    root.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
  )
}

const onKeydown = (e) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (e.key !== 'Tab') return
  const focusable = getFocusable()
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      lastFocused = document.activeElement
      document.body.style.overflow = 'hidden'
      await nextTick()
      closeBtnRef.value?.focus()
    } else {
      document.body.style.overflow = ''
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus()
    }
  }
)
</script>

<style scoped>
.sj-drawer-overlay-enter-active,
.sj-drawer-overlay-leave-active {
  transition: opacity 200ms ease;
}
.sj-drawer-overlay-enter-from,
.sj-drawer-overlay-leave-to {
  opacity: 0;
}

.sj-drawer-panel-enter-active,
.sj-drawer-panel-leave-active {
  transition: transform 220ms ease, opacity 220ms ease;
}
.sj-drawer-panel-enter-from,
.sj-drawer-panel-leave-to {
  transform: translateX(100%);
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .sj-drawer-overlay-enter-active,
  .sj-drawer-overlay-leave-active,
  .sj-drawer-panel-enter-active,
  .sj-drawer-panel-leave-active {
    transition: none;
  }
}
</style>
