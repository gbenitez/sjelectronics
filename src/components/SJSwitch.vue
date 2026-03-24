<template>
  <button
    type="button"
    class="inline-flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-neutral-50 transition-colors"
    :aria-pressed="modelValue"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      :class="modelValue ? 'bg-brand-secondary-600' : 'bg-neutral-300'"
    >
      <span
        class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform"
        :class="modelValue ? 'translate-x-5' : 'translate-x-1'"
      />
    </span>
    <span class="text-sm font-medium text-neutral-800">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])
</script>

