<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/55" @click="close"></div>
        
        <!-- Panel -->
        <div 
          class="relative bg-white rounded-xl shadow-lg max-w-2xl w-full p-5 max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-2xl font-bold text-neutral-900">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button 
              class="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              @click="close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div>
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="mt-6 pt-4 border-t border-neutral-200">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
