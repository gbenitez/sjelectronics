<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'neutral',
    validator: (value) => ['promo', 'new', 'neutral'].includes(value)
  }
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-pill px-2.5 py-1 text-xs font-semibold'
  
  const variants = {
    promo: 'bg-brand-primary-600 text-white',
    new: 'bg-brand-secondary-600 text-white',
    neutral: 'bg-neutral-100 text-neutral-700'
  }
  
  return `${base} ${variants[props.variant]}`
})
</script>
