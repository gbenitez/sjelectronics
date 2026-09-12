<template>
  <section
    class="relative overflow-hidden flex items-center text-white w-full"
    :class="heroFrameClass"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <!-- Backgrounds: art direction desk/móvil por <picture> (misma diapositiva) -->
    <div class="absolute inset-0">
      <picture
        v-for="(src, idx) in backgrounds"
        :key="`bg-${idx}-${src}`"
        class="absolute inset-0 block h-full w-full"
      >
        <source
          v-if="mobileBackgroundsResolved[idx]"
          media="(max-width: 1023px)"
          :srcset="mobileBackgroundsResolved[idx]"
        />
        <img
          :src="src"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover will-change-transform transition-opacity duration-[1200ms] ease-out motion-reduce:transition-none"
          :class="[idx === currentBg ? 'opacity-100' : 'opacity-0', baseFadeDelayClass]"
          :loading="idx === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
      </picture>
    </div>

    <!-- Capa de efecto de imagen. Se remonta en cada cambio (:key) para relanzar la animación. -->
    <div
      v-if="imageEffect"
      :key="`fx-${currentBg}`"
      class="absolute inset-0 overflow-hidden pointer-events-none"
      :style="effectVars"
      aria-hidden="true"
    >
      <template v-if="imageAnimation === 'slats'">
        <div v-for="i in slatCount" :key="i" class="sj-slat" :style="{ '--i': i - 1 }">
          <div class="sj-slat-img" />
        </div>
      </template>

      <template v-else-if="imageAnimation === 'ignite'">
        <div class="sj-ignite-img" />
        <div class="sj-ignite-band" />
      </template>

      <template v-else-if="imageAnimation === 'guillotine'">
        <div class="sj-guillotine-img" />
        <div class="sj-guillotine-bar" />
      </template>
    </div>

    <!-- Overlay direccional: protege el texto (izquierda) sin apagar el producto (derecha). -->
    <div class="absolute inset-0" :class="overlayClass" />
    <div class="absolute inset-0" :class="gradientClass" />

    <!-- Cortina de luz: el movimiento está en el overlay, nunca en la foto. -->
    <div
      v-if="imageAnimation === 'curtain'"
      :key="`curtain-${currentBg}`"
      class="sj-curtain absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />

    <!-- Side controls (optional) -->
    <button
      v-if="showControls && slideCount > 1"
      type="button"
      class="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/25 bg-sj-black/40 hover:bg-sj-black/60 backdrop-blur-sm transition focus-ring"
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
      class="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/25 bg-sj-black/40 hover:bg-sj-black/60 backdrop-blur-sm transition focus-ring"
      aria-label="Siguiente"
      @click="next"
    >
      <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- Content -->
    <div class="relative w-full">
      <div
        class="max-w-7xl mx-auto py-10 sm:py-12 lg:py-14"
        :class="showControls && slideCount > 1 ? 'px-16 sm:px-16 lg:px-8' : 'px-4 sm:px-6 lg:px-8'"
      >
        <div
          :key="`text-${current}`"
          class="max-w-3xl drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)]"
          :class="animateText && 'sj-hero-text'"
        >
          <p v-if="activeSlide.eyebrow" class="text-xs font-semibold uppercase tracking-wide text-white/80">
            {{ activeSlide.eyebrow }}
          </p>

          <p v-if="activeSlide.dateLabel" class="mt-3 text-xs font-semibold tracking-wide text-white/70">
            {{ activeSlide.dateLabel }}
          </p>

          <h1 class="mt-4 font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
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

          <div v-if="$slots.ctas" class="flex flex-wrap gap-4 mt-6">
            <slot name="ctas" />
          </div>
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
import { safeHref } from '../utils/publicAssetUrl'

const props = defineProps({
  backgrounds: { type: Array, required: true },
  /** Versiones verticales (p. ej. 1200×1600). Si hay, se usan bajo `md` y `backgrounds` desde `md`. */
  mobileBackgrounds: { type: Array, default: null },
  // Solo obligatorio si no se usa `slides` con título propio por slide (ver HomeHeroPage).
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  slides: { type: Array, default: null },
  showControls: { type: Boolean, default: false },
  showSlideCta: { type: Boolean, default: false },
  slideCtaLabel: { type: String, default: 'Ver más' },
  intervalMs: { type: Number, default: 3600 },
  /**
   * Frame del hero. Por defecto respeta el aspect de la guía A1:
   * desk 2560×1240 (≈2.064) y móvil 1200×1600 (3:4), para que object-cover
   * no recorte arriba/abajo. Se puede sobreescribir con minHeightClass.
   */
  minHeightClass: {
    type: String,
    default: '',
  },
  // Overlay direccional: oscurece solo la zona del texto (izquierda), deja el producto
  // legible y con su color real a la derecha. Nunca oscurecer la imagen completa.
  overlayClass: {
    type: String,
    default: 'bg-gradient-to-r from-sj-black/85 sm:from-sj-black/80 via-sj-black/35 to-transparent',
  },
  gradientClass: {
    type: String,
    default: 'bg-gradient-to-t from-sj-black/55 via-transparent to-transparent',
  },
  /**
   * Efecto de entrada de la imagen. Ninguno recorta ni escala la foto: la guía A1
   * exige que el hero entre completo, así que nada de zoom/pan tipo Ken Burns.
   *  - 'slats'      persiana vertical: 6 franjas que caen escalonadas.
   *  - 'ignite'     barrido de encendido: gris/apagado → color, con banda roja de calor.
   *  - 'guillotine' corte diagonal con barra roja de marca.
   *  - 'curtain'    la foto no se mueve; retrocede el overlay oscuro.
   *  - 'none'       solo el cross-fade de siempre.
   */
  imageAnimation: {
    type: String,
    default: 'none',
    validator: (v) => ['none', 'slats', 'ignite', 'guillotine', 'curtain'].includes(v),
  },
  /** Entrada escalonada del bloque de texto + subrayado rojo del título. */
  animateText: { type: Boolean, default: false },
})

const current = ref(0)
let timer = null
let reduceMotion = false

const mobileBackgroundsResolved = computed(() =>
  Array.isArray(props.mobileBackgrounds) ? props.mobileBackgrounds.filter(Boolean) : [],
)

/** Contenedor con el mismo ratio que el archivo → la imagen entra completa (sin crop). */
const heroFrameClass = computed(() => {
  if (props.minHeightClass) return props.minHeightClass
  // A1 PDF: móvil 1200×1600 (3:4); escritorio 2560×1240
  if (mobileBackgroundsResolved.value.length) {
    return 'aspect-[3/4] lg:aspect-[2560/1240]'
  }
  return 'aspect-[2560/1240]'
})

const SLAT_COUNT = 6
const slatCount = SLAT_COUNT

/** Variantes que pintan una capa con la imagen encima del cross-fade base. */
const imageEffect = computed(() => ['slats', 'ignite', 'guillotine'].includes(props.imageAnimation))

/**
 * Mientras la capa de efecto revela la imagen nueva, el cross-fade base espera:
 * así debajo se sigue viendo la saliente y no hay doble transición compitiendo.
 */
const baseFadeDelayClass = computed(() => (imageEffect.value ? '[transition-delay:900ms]' : ''))

const cssUrl = (src) => (src ? `url("${String(src).replace(/"/g, '%22')}")` : 'none')

/** La capa de efecto usa background-image (no <picture>) para no duplicar <img> en el DOM. */
const effectVars = computed(() => ({
  '--sj-bg-desk': cssUrl(props.backgrounds?.[currentBg.value]),
  '--sj-bg-mobile': cssUrl(
    mobileBackgroundsResolved.value[currentBg.value] || props.backgrounds?.[currentBg.value],
  ),
  '--sj-slats': String(SLAT_COUNT),
}))

const bgCount = computed(() => Math.max(Array.isArray(props.backgrounds) ? props.backgrounds.length : 0, 1))

const slideCount = computed(() => {
  const nSlides = Array.isArray(props.slides) ? props.slides.length : 0
  return Math.max(nSlides, bgCount.value, 1)
})

/** Índice de fondo: si hay más slides de texto que imágenes, cicla las imágenes. */
const currentBg = computed(() => current.value % bgCount.value)

const activeSlide = computed(() => {
  const idx = current.value || 0
  const s = Array.isArray(props.slides) ? props.slides[idx] : null
  return {
    eyebrow: (s && typeof s.eyebrow === 'string' ? s.eyebrow : props.eyebrow) || '',
    dateLabel: (s && typeof s.dateLabel === 'string' ? s.dateLabel : '') || '',
    href: safeHref(s && typeof s.href === 'string' ? s.href : '') || '',
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
  () => [
    props.intervalMs,
    props.backgrounds.length,
    mobileBackgroundsResolved.value.length,
    Array.isArray(props.slides) ? props.slides.length : 0,
  ],
  () => {
    stop()
    current.value = 0
    resume()
  },
)
</script>


<style scoped>
/* Capas de efecto del hero.
   Regla común: ninguna escala ni desplaza la foto en reposo — la imagen queda
   siempre completa y centrada, como pide la guía A1. Lo que se anima es el
   revelado (clip/máscara/franjas) o la luz, nunca el encuadre. */

.sj-slat-img,
.sj-ignite-img,
.sj-guillotine-img {
  position: absolute;
  inset: 0;
  background-image: var(--sj-bg-mobile);
  background-size: cover;
  background-position: center;
}

@media (min-width: 1024px) {
  .sj-slat-img,
  .sj-ignite-img,
  .sj-guillotine-img {
    background-image: var(--sj-bg-desk);
  }
}

/* 1. Persiana vertical ------------------------------------------------- */
.sj-slat {
  position: absolute;
  top: 0;
  bottom: 0;
  width: calc(100% / var(--sj-slats));
  left: calc(var(--i) * 100% / var(--sj-slats));
  overflow: hidden;
}

.sj-slat-img {
  /* El interior mide el ancho completo del hero y se reposiciona hacia atrás,
     así cada franja muestra su porción real de la imagen. */
  width: calc(var(--sj-slats) * 100%);
  left: calc(var(--i) * -100%);
  animation: sj-slat-drop 620ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--i) * 70ms);
}

@keyframes sj-slat-drop {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}

/* 2. Barrido de encendido ---------------------------------------------- */
.sj-ignite-img {
  animation: sj-ignite 1100ms ease-out backwards;
}

@keyframes sj-ignite {
  from { filter: grayscale(1) brightness(0.45) contrast(1.1); }
  60% { filter: grayscale(0.35) brightness(0.85); }
  to { filter: none; }
}

.sj-ignite-band {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 40%,
    rgba(225, 6, 0, 0.45) 48%,
    rgba(255, 180, 180, 0.5) 52%,
    transparent 60%
  );
  mix-blend-mode: screen;
  animation: sj-ignite-band 1100ms ease-out forwards;
}

@keyframes sj-ignite-band {
  from { transform: translateX(-100%); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

/* 3. Guillotina roja diagonal ------------------------------------------ */
.sj-guillotine-img {
  animation: sj-guillotine 900ms cubic-bezier(0.65, 0, 0.35, 1) backwards;
}

@keyframes sj-guillotine {
  from { clip-path: polygon(0 0, 0 0, -25% 100%, -25% 100%); }
  to { clip-path: polygon(0 0, 125% 0, 125% 100%, 0 100%); }
}

.sj-guillotine-bar {
  position: absolute;
  top: -10%;
  bottom: -10%;
  left: 0;
  width: 14vw;
  background: #b00711;
  transform-origin: center;
  animation: sj-guillotine-bar 900ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes sj-guillotine-bar {
  from { transform: translateX(-120%) skewX(-12deg); }
  to { transform: translateX(780%) skewX(-12deg); }
}

/* 4. Cortina de luz ----------------------------------------------------- */
.sj-curtain {
  background: linear-gradient(90deg, #0a0a0a 70%, rgba(10, 10, 10, 0) 100%);
  animation: sj-curtain 1000ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes sj-curtain {
  from { transform: translateX(0); }
  to { transform: translateX(-115%); }
}

/* 5. Entrada escalonada del texto -------------------------------------- */
.sj-hero-text > * {
  animation: sj-text-in 700ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

.sj-hero-text > :nth-child(1) { animation-delay: 60ms; }
.sj-hero-text > :nth-child(2) { animation-delay: 140ms; }
.sj-hero-text > :nth-child(3) { animation-delay: 220ms; }
.sj-hero-text > :nth-child(4) { animation-delay: 300ms; }
.sj-hero-text > :nth-child(5) { animation-delay: 380ms; }

@keyframes sj-text-in {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Subrayado rojo que barre el ancho del título. */
.sj-hero-text h1 {
  position: relative;
  display: inline-block;
}

.sj-hero-text h1::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.18em;
  height: 4px;
  width: 100%;
  background: #e10600;
  transform-origin: left center;
  animation: sj-underline 620ms cubic-bezier(0.22, 1, 0.36, 1) 420ms backwards;
}

@keyframes sj-underline {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@media (prefers-reduced-motion: reduce) {
  .sj-slat-img,
  .sj-ignite-img,
  .sj-ignite-band,
  .sj-guillotine-img,
  .sj-guillotine-bar,
  .sj-curtain,
  .sj-hero-text > *,
  .sj-hero-text h1::after {
    animation: none !important;
  }

  .sj-ignite-band,
  .sj-guillotine-bar,
  .sj-curtain {
    display: none;
  }
}
</style>
