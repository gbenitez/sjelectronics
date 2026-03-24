<template>
  <div>
    <div class="border-b border-neutral-200">
      <nav class="flex gap-6 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="tabClasses(tab.id)"
          @click="$emit('update:modelValue', tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])

const tabClasses = (tabId) => {
  const base = 'pb-3 text-sm font-medium border-b-2 transition-colors'
  const isActive = props.modelValue === tabId
  
  if (isActive) {
    return `${base} border-brand-primary-600 text-neutral-900`
  }
  
  return `${base} border-transparent text-neutral-400 hover:text-neutral-600`
}
</script>
