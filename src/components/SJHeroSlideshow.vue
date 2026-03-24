<template>
  <section
    class="relative overflow-hidden flex items-center text-white"
    :class="minHeightClass"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <!-- Backgrounds -->
    <div class="absolute inset-0">
      <img
        v-for="(src, idx) in backgrounds"
        :key="`${src}-${idx}`"
        :src="src"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover will-change-transform transition-opacity duration-[1200ms] ease-out motion-reduce:transition-none"
        :class="idx === current ? 'opacity-100' : 'opacity-0'"
        :loading="idx === 0 ? 'eager' : 'lazy'"
        decoding="async"
      />
    </div>

    <!-- Overlay -->
    <div class="absolute inset-0" :class="overlayClass" />
    <div class="absolute inset-0" :class="gradientClass" />

    <!-- Side controls (optional) -->
    <button
      v-if="showControls && slideCount > 1"
      type="button"
      class="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/20 bg-black/25 hover:bg-black/35 transition focus-ring"
      aria-label="Anterior"
      @click="prev"
    >
      <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <button
      v-if="showControls && slideCount > 1"
      type="button"
      class="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/20 bg-black/25 hover:bg-black/35 transition focus-ring"
      aria-label="Siguiente"
      @click="next"
    >
      <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- Content -->
    <div class="relative w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div class="max-w-3xl drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)]">
          <p v-if="activeSlide.eyebrow" class="text-xs font-semibold uppercase tracking-wide text-white/80">
            {{ activeSlide.eyebrow }}
          </p>

          <p v-if="activeSlide.dateLabel" class="mt-3 text-xs font-semibold tracking-wide text-white/70">
            {{ activeSlide.dateLabel }}
          </p>

          <h1 class="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            {{ activeSlide.title }}
          </h1>
          <p v-if="activeSlide.subtitle" class="mt-5 text-base sm:text-lg text-white/80 leading-relaxed">
            {{ activeSlide.subtitle }}
          </p>

          <a
            v-if="showSlideCta && activeSlide.href"
            class="btn btn-primary mt-6"
            :href="activeSlide.href"
          >
            {{ slideCtaLabel }}
          </a>
        </div>
      </div>
    </div>

    <!-- Dots (bottom centered) -->
    <div
      v-if="showControls && slideCount > 1"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center gap-2"
      aria-label="Controles del carrusel"
    >
      <button
        v-for="(_, idx) in slideCount"
        :key="idx"
        type="button"
        class="h-2.5 w-2.5 rounded-full transition border border-white/30"
        :class="idx === current ? 'bg-white/85' : 'bg-white/15 hover:bg-white/35'"
        @click="goTo(idx)"
        :aria-label="`Ir al slide ${idx + 1}`"
        :aria-current="idx === current ? 'true' : 'false'"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  backgrounds: { type: Array, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  slides: { type: Array, default: null },
  showControls: { type: Boolean, default: false },
  showSlideCta: { type: Boolean, default: false },
  slideCtaLabel: { type: String, default: 'Ver más' },
  intervalMs: { type: Number, default: 3600 },
  minHeightClass: {
    type: String,
    default: 'min-h-[520px] sm:min-h-[560px] lg:min-h-[620px]',
  },
  overlayClass: {
    type: String,
    default: 'bg-neutral-950/70 dark:bg-neutral-950/55',
  },
  gradientClass: {
    type: String,
    default:
      'bg-gradient-to-b from-neutral-950/75 via-neutral-950/35 to-neutral-950/80 ' +
      'dark:from-neutral-950/65 dark:via-neutral-950/30 dark:to-neutral-950/75',
  },
})

const current = ref(0)
let timer = null
let reduceMotion = false

const slideCount = computed(() => {
  const nSlides = Array.isArray(props.slides) ? props.slides.length : 0
  const nBgs = Array.isArray(props.backgrounds) ? props.backgrounds.length : 0
  return Math.max(nSlides, nBgs, 1)
})

const activeSlide = computed(() => {
  const idx = current.value || 0
  const s = Array.isArray(props.slides) ? props.slides[idx] : null
  return {
    eyebrow: (s && typeof s.eyebrow === 'string' ? s.eyebrow : props.eyebrow) || '',
    dateLabel: (s && typeof s.dateLabel === 'string' ? s.dateLabel : '') || '',
    href: (s && typeof s.href === 'string' ? s.href : '') || '',
    title: (s && typeof s.title === 'string' ? s.title : props.title) || props.title,
    subtitle: (s && typeof s.subtitle === 'string' ? s.subtitle : props.subtitle) || '',
  }
})

const goTo = (idx) => {
  const len = slideCount.value || 1
  const i = Number(idx)
  if (!Number.isFinite(i)) return
  current.value = ((i % len) + len) % len
}

const next = () => {
  goTo((current.value + 1) % slideCount.value)
}

const prev = () => {
  goTo(current.value - 1)
}

const stop = () => {
  if (timer) clearInterval(timer)
  timer = null
}

const resume = () => {
  if (reduceMotion) return
  if (slideCount.value <= 1) return
  if (timer) return
  timer = setInterval(next, props.intervalMs)
}

const pause = () => stop()

onMounted(() => {
  reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  resume()
})

onBeforeUnmount(stop)

watch(
  () => [props.intervalMs, props.backgrounds.length, Array.isArray(props.slides) ? props.slides.length : 0],
  () => {
    stop()
    current.value = 0
    resume()
  },
)
</script>

