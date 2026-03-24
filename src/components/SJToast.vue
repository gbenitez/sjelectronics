<template>
  <div :class="toastClasses">
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <component :is="iconComponent" class="w-5 h-5" />
      </div>
      <div class="flex-1">
        <p class="font-semibold text-sm">{{ title }}</p>
        <p v-if="message" class="text-sm mt-0.5">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'danger', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: String
})

const toastClasses = computed(() => {
  const base = 'rounded-lg shadow-md p-3.5 border'
  
  const variants = {
    success: 'bg-green-50 text-green-800 border-green-200',
    danger: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  }
  
  return `${base} ${variants[props.variant]}`
})

const iconComponent = computed(() => {
  const icons = {
    success: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '2', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    danger: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '2', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' })
    ]),
    info: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '2', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z' })
    ])
  }
  
  return icons[props.variant]
})
</script>
