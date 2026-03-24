<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  elevated: {
    type: Boolean,
    default: false
  },
  padding: {
    type: String,
    default: '4'
  }
})

const cardClasses = computed(() => {
  const base = 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg text-neutral-900 dark:text-white'
  const shadow = props.elevated ? 'shadow-md' : 'shadow-sm'

  // Tailwind no genera clases dinámicas como `p-${padding}`.
  // Mapeamos a clases explícitas para asegurar que se apliquen.
  const paddingMap = {
    '0': 'p-0',
    '2': 'p-2',
    '3': 'p-3',
    '4': 'p-4',
    '5': 'p-5',
    '6': 'p-6',
    '8': 'p-8',
    '10': 'p-10',
    '12': 'p-12'
  }

  const pad = paddingMap[props.padding] ?? 'p-4'

  return `${base} ${shadow} ${pad}`
})
</script>
