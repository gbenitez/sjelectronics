<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'destructive'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-none min-h-[44px] focus-ring ' +
    'transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out motion-reduce:transition-none'
  
  const variants = {
    primary: 'bg-brand-primary-600 text-white hover:bg-brand-primary-700 active:bg-brand-primary-800 disabled:bg-neutral-200 disabled:text-neutral-500',
    secondary: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-900 disabled:bg-neutral-200 disabled:text-neutral-500',
    outline: 'bg-transparent text-neutral-900 dark:text-white border-2 border-neutral-300 dark:border-white/15 hover:bg-neutral-50 dark:hover:bg-white/5 active:bg-neutral-100 dark:active:bg-white/10 disabled:text-neutral-500 disabled:border-neutral-200',
    ghost: 'bg-transparent text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-white/5 active:bg-neutral-100 dark:active:bg-white/10 disabled:text-neutral-500',
    destructive: 'bg-red-700 text-white hover:bg-red-800 active:bg-red-900 disabled:bg-neutral-200 disabled:text-neutral-500'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-[18px] py-3 text-lg'
  }
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>
