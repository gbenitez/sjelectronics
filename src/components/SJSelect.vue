<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-neutral-700 dark:text-white/80">
      {{ label }}
      <span v-if="required" class="text-brand-primary-600">*</span>
    </label>

    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </option>
    </select>

    <p v-if="error" class="text-sm text-red-700">{{ error }}</p>
    <p v-else-if="helperText" class="text-sm text-neutral-500 dark:text-white/60">{{ helperText }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: String,
  modelValue: [String, Number],
  label: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  helperText: String,
  options: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue'])

const selectClasses = computed(() => {
  const base =
    'w-full min-h-[44px] px-3 py-2.5 rounded-md border bg-white text-neutral-900 transition-colors focus:outline-none focus:ring-3 focus:ring-brand-secondary-500/35 focus:ring-offset-2'
  const themed = 'dark:bg-neutral-950 dark:text-white dark:border-white/10'

  if (props.disabled) return `${base} ${themed} bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-white/45 cursor-not-allowed border-neutral-200 dark:border-white/10`
  if (props.error) return `${base} ${themed} border-red-300 focus:border-red-500`
  return `${base} ${themed} border-neutral-200 focus:border-brand-secondary-500`
})
</script>

