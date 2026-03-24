<template>
  <button
    type="button"
    class="inline-flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-neutral-50 transition-colors"
    :class="disabled ? 'opacity-60 cursor-not-allowed hover:bg-transparent' : ''"
    :disabled="disabled"
    @click="toggle"
    :aria-pressed="modelValue"
  >
    <span
      class="flex h-5 w-5 items-center justify-center rounded-md border transition-colors"
      :class="boxClasses"
    >
      <svg v-if="indeterminate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-white">
        <path d="M5 11h14v2H5z" />
      </svg>
      <svg v-else-if="modelValue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-white">
        <path d="M9.55 16.2 5.8 12.45l-1.4 1.4 5.15 5.15L20.6 7.95l-1.4-1.4z" />
      </svg>
    </span>
    <span class="text-sm font-medium text-neutral-800">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const boxClasses = computed(() => {
  if (props.indeterminate || props.modelValue) return 'bg-brand-secondary-600 border-brand-secondary-600'
  return 'bg-white border-neutral-300'
})

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

