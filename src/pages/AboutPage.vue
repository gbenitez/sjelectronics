<template>
  <div class="bg-white text-neutral-900 dark:bg-sj-black dark:text-white">
    <SJHeroSlideshow
      eyebrow="Nuestra historia"
      title="Esto es lo que nos define"
      subtitle="SJ Electronics nace para acercar tecnología y electrodomésticos a más hogares, con un enfoque en calidad, garantía y soporte."
      :backgrounds="heroBackgrounds"
      :interval-ms="3600"
    />

    <!-- Historia / Propósito -->
    <section class="py-14 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div class="lg:col-span-6">
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400">
              Quiénes somos
            </p>
            <h1 class="mt-3 font-display font-bold text-3xl sm:text-4xl leading-tight">
              Tecnología y electrodomésticos para cada cocina y cada hogar
            </h1>
            <p class="mt-5 text-base sm:text-lg text-neutral-600 dark:text-white/70 leading-relaxed">
              SJ Electronics es una marca venezolana de electrodomésticos para el hogar y la cocina: air fryers,
              sandwicheras, parrillas eléctricas, ollas, licuadoras y sus repuestos. Trabajamos con distribuidores
              a nivel nacional para que cada equipo llegue con garantía, asesoría clara y soporte real.
            </p>
            <p class="mt-4 text-base sm:text-lg text-neutral-600 dark:text-white/70 leading-relaxed">
              Diseñamos productos robustos y de uso diario, pensados para acompañar tu rutina en la cocina sin
              complicaciones.
            </p>
          </div>
          <div class="lg:col-span-6">
            <div class="aspect-[4/3] border border-neutral-200 dark:border-white/10 overflow-hidden">
              <img
                :src="heroBackgrounds[1]"
                alt="Cocina equipada con electrodomésticos SJ"
                class="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cobertura nacional -->
    <section class="py-14 sm:py-16 lg:py-20 bg-sj-black text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div class="lg:col-span-5">
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-400">Cobertura</p>
            <h2 class="mt-3 font-display font-bold text-3xl sm:text-4xl leading-tight">
              Distribución a nivel nacional
            </h2>
            <p class="mt-5 text-base sm:text-lg text-white/70 leading-relaxed">
              Llegamos a más hogares a través de una red de distribuidores en todo el país, con asesoría antes y
              después de la compra, y repuestos disponibles para prolongar la vida útil de tu equipo.
            </p>
            <div class="mt-8">
              <a class="btn btn-outline border-white/25 text-white hover:bg-white/10 active:bg-white/15" href="#/contacto">
                ¿Dónde comprar?
              </a>
            </div>
          </div>
          <div class="lg:col-span-7 grid sm:grid-cols-3 gap-5 sm:gap-6">
            <div v-for="f in coverageFacts" :key="f.title" class="border border-white/10 p-6">
              <div class="h-9 w-9 text-brand-primary-500">
                <svg viewBox="0 0 24 24" fill="none" class="h-full w-full">
                  <path :d="f.icon" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <h3 class="mt-4 font-display font-bold text-lg">{{ f.title }}</h3>
              <p class="mt-1.5 text-sm text-white/60 leading-relaxed">{{ f.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Valores (máx. 3) -->
    <section class="py-14 sm:py-16 lg:py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p class="text-xs font-semibold uppercase tracking-wide text-brand-primary-600 dark:text-brand-primary-400">
            Lo que nos define
          </p>
          <h2 class="mt-3 font-display font-bold text-3xl sm:text-4xl leading-tight">
            Nuestros valores
          </h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <article v-for="v in values" :key="v.title" class="relative border border-neutral-200 dark:border-white/10 overflow-hidden">
            <div class="relative h-[140px] overflow-hidden">
              <img :src="v.image" alt="" class="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
              <div class="absolute inset-0 bg-gradient-to-t from-sj-black/85 via-sj-black/25 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 px-5 pb-4">
                <div class="font-display font-bold text-xl text-white">{{ v.title }}</div>
              </div>
            </div>
            <p class="px-5 py-5 text-sm text-neutral-600 dark:text-white/70 leading-relaxed">
              {{ v.text }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Prueba social -->
    <section class="py-14 sm:py-16 lg:py-20 bg-neutral-50 dark:bg-white/[0.03]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid sm:grid-cols-2 gap-6">
          <a
            href="https://instagram.com/sj_electronics"
            target="_blank"
            rel="noreferrer"
            class="group flex items-center gap-5 border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 hover:border-brand-primary-500 transition focus-ring"
          >
            <div class="shrink-0 h-14 w-14 rounded-full border-2 border-brand-primary-600 flex items-center justify-center text-brand-primary-600">
              <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6" />
                <circle cx="17" cy="7" r="1" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div class="font-display font-bold text-xl group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400 transition-colors">
                @sj_electronics
              </div>
              <p class="text-sm text-neutral-600 dark:text-white/60 mt-1">
                369 mil seguidores nos acompañan en Instagram todos los días.
              </p>
            </div>
          </a>

          <div class="flex items-center gap-5 border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <div class="shrink-0 h-14 w-14 rounded-full border-2 border-brand-primary-600 flex items-center justify-center text-brand-primary-600">
              <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7">
                <path d="M3 12h18M3 12l4-6h10l4 6M3 12l4 6h10l4-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <div class="font-display font-bold text-xl">Distribuidores en todo el país</div>
              <p class="text-sm text-neutral-600 dark:text-white/60 mt-1">
                Encuentra SJ Electronics cerca de ti a través de nuestra red de distribución nacional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Closing -->
    <section class="bg-brand-primary-600">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 class="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
          Conoce nuestro catálogo
        </h2>
        <p class="mt-4 text-white/85 text-base sm:text-lg max-w-xl mx-auto">
          Electrodomésticos pensados para tu cocina y tu hogar, con garantía y asesoría real.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <a class="inline-flex items-center justify-center min-h-[44px] px-6 border-2 border-white bg-white text-brand-primary-700 font-semibold hover:bg-white/90 transition focus-ring" href="#/productos">
            Explorar catálogo
          </a>
          <a class="inline-flex items-center justify-center min-h-[44px] px-6 border-2 border-white text-white font-semibold hover:bg-white/10 transition focus-ring" href="#/contacto">
            Hablar con ventas
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'
import { usePageMeta } from '../composables/usePageMeta'

usePageMeta({
  title: 'Quiénes somos',
  description: 'Conoce a SJ Electronics: distribución a nivel nacional, garantía, asesoría y una comunidad de más de 369 mil seguidores.',
  path: '/quienes-somos',
})

const srcFor = (filename) => `/${encodeURI(String(filename))}`

const heroBackgrounds = computed(() => [
  srcFor('banner 2026-02-07 at 15.10.29.png'),
  srcFor('banner 2026-02-07 at 15.09.20.png'),
  srcFor('banner 2026-02-07 at 15.14.55.png'),
  srcFor('banner 2026-02-07 at 15.16.21.png'),
  srcFor('banner 2026-02-07 at 15.11.01.png')
])

// TODO: reemplazar por cifras reales (años en el mercado, distribuidores activos,
// unidades entregadas) cuando estén confirmadas por la marca.
const coverageFacts = [
  {
    title: 'Garantía',
    text: 'Productos respaldados con garantía del fabricante.',
    icon: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 9.2 1.8 1.8 3.2-3.6',
  },
  {
    title: 'Asesoría',
    text: 'Te acompañamos antes y después de tu compra.',
    icon: 'M8 10h8M8 14h5M21 12c0 4.4-4 8-9 8-1.2 0-2.4-.2-3.4-.6L3 21l1.7-4.2A7.9 7.9 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z',
  },
  {
    title: 'Repuestos',
    text: 'Piezas y soporte técnico disponibles.',
    icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z',
  },
]

const valueImages = {
  innovacion: srcFor('banner 2026-02-07 at 15.10.29.png'),
  compromiso: srcFor('banner 2026-02-07 at 15.09.20.png'),
  seguridad: srcFor('banner 2026-02-07 at 15.11.01.png'),
}

const values = [
  {
    title: 'Innovación',
    image: valueImages.innovacion,
    text: 'Incorporamos tecnología que hace que cocinar sea más simple, rápido y placentero.',
  },
  {
    title: 'Compromiso',
    image: valueImages.compromiso,
    text: 'Relaciones sólidas con nuestros clientes y distribuidores, basadas en confianza y transparencia.',
  },
  {
    title: 'Seguridad',
    image: valueImages.seguridad,
    text: 'Equipos pensados para el uso diario, con garantía y soporte posventa real.',
  },
]
</script>
