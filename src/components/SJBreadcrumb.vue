<template>
  <nav aria-label="Breadcrumb" class="text-sm">
    <ol class="flex items-center gap-2">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-2">
        <a 
          v-if="index < items.length - 1"
          :href="item.href"
          class="text-brand-secondary-600 hover:text-brand-secondary-700 transition-colors"
          @click.prevent="$emit('navigate', item)"
        >
          {{ item.label }}
        </a>
        <span v-else class="text-neutral-900 font-semibold">
          {{ item.label }}
        </span>
        <span v-if="index < items.length - 1" class="text-neutral-400">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})

defineEmits(['navigate'])
</script>
