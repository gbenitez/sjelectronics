<template>
  <div 
    class="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg shadow-sm p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
  >
    <!-- Imagen del producto -->
    <div class="relative aspect-square bg-neutral-50 dark:bg-white/5 rounded-md mb-3 overflow-hidden border border-transparent dark:border-white/10">
      <img 
        v-if="resolvedImage"
        :src="resolvedImage" 
        :alt="product.name"
        class="w-full h-full object-contain sj-img-grayscale-hover-group"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-neutral-300 dark:text-white/25">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      <SJBadge v-if="showBadges && product.discount" variant="promo" class="absolute top-2 right-2">
        -{{ product.discount }}%
      </SJBadge>
      <SJBadge v-if="showBadges && product.isNew" variant="new" class="absolute top-2 left-2">
        Nuevo
      </SJBadge>
    </div>

    <!-- Información del producto -->
    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-2 min-h-[40px]">
        {{ product.name }}
      </h3>
      
      <div v-if="showPrice" class="flex items-baseline gap-2">
        <span class="text-lg font-bold text-neutral-900">
          ${{ product.currentPrice.toLocaleString('es-US', { minimumFractionDigits: 2 }) }}
        </span>
        <span v-if="product.originalPrice" class="text-sm text-neutral-400 line-through">
          ${{ product.originalPrice.toLocaleString('es-US', { minimumFractionDigits: 2 }) }}
        </span>
      </div>

      <!-- Acciones -->
      <div v-if="showActions" class="flex gap-2 pt-2">
        <SJButton v-if="showAddToCart" size="sm" class="flex-1" @click="$emit('add-to-cart', product)">
          Agregar
        </SJButton>
        <button
          v-if="showDetails"
          class="px-2 py-2 rounded-none border-2 border-neutral-300 dark:border-white/15 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
          @click="$emit('view-details', product)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SJButton from './SJButton.vue'
import SJBadge from './SJBadge.vue'
import { publicAssetUrl } from '../utils/publicAssetUrl'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  showBadges: { type: Boolean, default: true },
  showPrice: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  showAddToCart: { type: Boolean, default: true },
  showDetails: { type: Boolean, default: true }
})

defineEmits(['add-to-cart', 'view-details'])

const resolvedImage = computed(() => publicAssetUrl(props.product?.image))
</script>
