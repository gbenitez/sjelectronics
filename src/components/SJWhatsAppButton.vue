<template>
  <a
    :href="href"
    target="_blank"
    rel="noreferrer"
    class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:brightness-105 active:brightness-95 transition focus-ring"
    aria-label="Escríbenos por WhatsApp"
    title="Escríbenos por WhatsApp"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7">
      <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.85-1.27A9.5 9.5 0 1 0 12 2.5Zm0 1.8a7.7 7.7 0 0 1 6.6 11.65l-.19.31.5 1.83-1.87-.49-.3.18A7.7 7.7 0 1 1 12 4.3Zm-3.1 3.5c-.2 0-.5.06-.77.36-.26.3-1 .98-1 2.4 0 1.4 1.03 2.77 1.17 2.96.14.19 1.98 3.13 4.9 4.27 2.42.95 2.92.76 3.44.71.53-.05 1.7-.7 1.94-1.36.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33-.29-.15-1.7-.84-1.96-.93-.26-.1-.46-.15-.65.14-.19.29-.75.93-.92 1.12-.17.19-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.44.13-.59.13-.13.29-.34.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.65-1.63-.9-2.23-.23-.57-.47-.5-.65-.5Z"/>
    </svg>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { whatsappLink } from '../config/whatsapp'

const props = defineProps({
  message: {
    type: String,
    default: 'Hola SJ Electronics, quiero más información sobre sus productos.',
  },
})

const href = computed(() => whatsappLink(props.message))
</script>
