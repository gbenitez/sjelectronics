<template>
  <section class="relative">
    <div class="relative overflow-hidden rounded-xl bg-neutral-200 border border-neutral-200">
      <div class="h-[240px] sm:h-[320px] lg:h-[380px] w-full">
        <!-- Slideshow track -->
        <div
          class="h-full w-full flex transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
          :style="{ transform: `translate3d(-${current * 100}%, 0, 0)` }"
          @mouseenter="stop"
          @mouseleave="start"
        >
          <div v-for="(img, idx) in images" :key="idx" class="h-full w-full flex-none">
            <img
              :src="srcFor(img)"
              :alt="alt"
              class="h-full w-full object-cover sj-img-grayscale-hover"
              :loading="idx === 0 ? 'eager' : 'lazy'"
              decoding="async"
              @error="onImgError"
            />
          </div>
        </div>
      </div>

      <!-- overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/55 via-neutral-950/10 to-transparent"></div>

      <div class="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
        <div class="flex flex-col gap-3">
          <div class="max-w-2xl">
            <p class="text-white/85 text-sm font-semibold tracking-wide uppercase">SJ Electronics</p>
            <h1 class="text-white font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight">
              Tecnología y electrodomésticos para tu hogar
            </h1>
            <p class="text-white/90 mt-2 text-sm sm:text-base">
              Encuentra productos confiables, ofertas y soporte cercano.
            </p>
          </div>
        </div>
      </div>

      <!-- dots -->
      <div class="absolute left-0 right-0 bottom-2 sm:bottom-3">
        <div class="flex justify-center gap-2">
          <button
            v-for="(_, idx) in images"
            :key="idx"
            type="button"
            class="h-0.5 w-10 transition-all"
            :class="idx === current ? 'bg-white w-14' : 'bg-white/50 hover:bg-white/80'"
            :aria-label="`Ir al banner ${idx + 1}`"
            @click="go(idx)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  alt: { type: String, default: 'Banner SJ Electronics' },
  autoplay: { type: Boolean, default: true },
  intervalMs: { type: Number, default: 4500 }
})

const current = ref(0)
let timer = null
let isStarting = false

const srcFor = (filename) => {
  // `publicDir` está apuntando a `imagen/`, así que quedan en la raíz.
  // Ej: /banner%202026-...png
  return `/${encodeURI(String(filename))}`
}

const clampIndex = (n) => {
  const len = props.images.length || 1
  return ((n % len) + len) % len
}

const go = (idx) => {
  current.value = clampIndex(idx)
}
const next = () => go(current.value + 1)

const start = () => {
  if (!props.autoplay || props.images.length <= 1) return
  if (isStarting) return
  isStarting = true
  stop()
  timer = setInterval(() => next(), props.intervalMs)
  isStarting = false
}
const stop = () => {
  if (timer) clearInterval(timer)
  timer = null
}

const onImgError = () => {
  // Si alguna imagen falta, brincamos a la siguiente para no dejar el banner vacío.
  next()
}

onMounted(start)
onBeforeUnmount(stop)

watch(
  () => [props.autoplay, props.intervalMs, props.images.length],
  () => start()
)
</script>

