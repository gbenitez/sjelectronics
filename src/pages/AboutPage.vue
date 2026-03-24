<template>
  <div class="relative bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white overflow-hidden">
    <!-- Hero (como Home): solo banner, sin botones -->
    <SJHeroSlideshow
      eyebrow="Nuestra historia"
      title="Esto es lo que nos define"
      subtitle="SJ Electronics nace para acercar tecnología y electrodomésticos a más hogares, con un enfoque en calidad, garantía y soporte."
      :backgrounds="heroBackgrounds"
      :interval-ms="3600"
    />

    <!-- Values: Innovación / Compromiso / Seguridad -->
    <section class="pb-12 sm:pb-14 pt-12 sm:pt-14">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 class="font-display font-extrabold text-3xl sm:text-4xl leading-[1.05]">
            La Historia y el<br class="hidden sm:block" />
            corazón de SJ electronic
          </h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <article class="relative border border-neutral-900/10 bg-white dark:border-white/10 dark:bg-white/0">
            <div class="px-6 pt-4 pb-3">
              <div class="inline-flex px-4 py-2 bg-white text-neutral-950 font-display font-extrabold text-xl leading-none">
                Innovación
              </div>
            </div>
            <div class="relative h-[120px] overflow-hidden">
              <div class="absolute inset-0 bg-cover bg-center opacity-75" :style="{ backgroundImage: `url(${valueImages.innovacion})` }" />
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 px-6 pb-5">
                <p class="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Con tecnologías avanzadas que hacen que cocinar sea más eficiente, emocionante y gratificante.
                  Estamos constantemente explorando nuevas formas de mejorar tu experiencia culinaria.
                </p>
              </div>
            </div>
          </article>

          <article class="relative border border-neutral-900/10 bg-white dark:border-white/10 dark:bg-white/0">
            <div class="px-6 pt-4 pb-3">
              <div class="inline-flex px-4 py-2 bg-white text-neutral-950 font-display font-extrabold text-xl leading-none">
                Compromiso
              </div>
            </div>
            <div class="relative h-[120px] overflow-hidden">
              <div class="absolute inset-0 bg-cover bg-center opacity-75" :style="{ backgroundImage: `url(${valueImages.compromiso})` }" />
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 px-6 pb-5">
                <p class="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Nos esforzamos por establecer relaciones sólidas y duraderas con nuestros clientes, basadas en la
                  confianza, la transparencia y el servicio excepcional.
                </p>
              </div>
            </div>
          </article>

          <article class="relative border border-neutral-900/10 bg-white dark:border-white/10 dark:bg-white/0">
            <div class="px-6 pt-4 pb-3">
              <div class="inline-flex px-4 py-2 bg-white text-neutral-950 font-display font-extrabold text-xl leading-none">
                Seguridad
              </div>
            </div>
            <div class="relative h-[120px] overflow-hidden">
              <div class="absolute inset-0 bg-cover bg-center opacity-75" :style="{ backgroundImage: `url(${valueImages.seguridad})` }" />
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 px-6 pb-5">
                <p class="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Estamos comprometidos a comprender y satisfacer tus necesidades en cada paso del camino, desde la
                  investigación y desarrollo hasta la entrega y el soporte posventa.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Statement -->
    <section class="py-10 sm:py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-display font-extrabold text-3xl sm:text-4xl leading-[1.05]">
          Mereces la tecnología<br class="hidden sm:block" /> más avanzada
        </h2>
        <p class="mt-4 text-xs sm:text-sm text-neutral-600 dark:text-white/55 max-w-xl mx-auto">
          Decidimos enfocarnos en una visión y misión donde tú seas el protagonista.
        </p>
      </div>
    </section>

    <!-- Misión / Visión blocks -->
    <section class="pb-16 sm:pb-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-6 md:grid-cols-2">
          <article class="relative overflow-hidden border border-neutral-900/10 dark:border-white/10">
            <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${mvImages.mision})` }" />
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent" />
            <div class="relative p-8 sm:p-10 min-h-[220px] flex items-end">
              <div class="w-full">
                <div class="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">Misión</div>
                <div class="mt-4 bg-neutral-950/75 border border-white/10 px-5 py-4 text-sm text-white/80 leading-relaxed">
                  Innovar continuamente con diseños modernos en productos de alta gama, manteniendo los estándares de
                  calidad y garantía, para satisfacer a los más exigentes.
                </div>
              </div>
            </div>
          </article>

          <article class="relative overflow-hidden border border-neutral-900/10 dark:border-white/10">
            <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${mvImages.vision})` }" />
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent" />
            <div class="relative p-8 sm:p-10 min-h-[220px] flex items-end">
              <div class="w-full">
                <div class="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">Visión</div>
                <div class="mt-4 bg-neutral-950/75 border border-white/10 px-5 py-4 text-sm text-white/80 leading-relaxed">
                  Consolidarnos como la marca líder en el mercado de fabricación y comercialización de electrodomésticos
                  de alta gama.
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Closing -->
    <section class="pb-20 sm:pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-display font-extrabold text-3xl sm:text-4xl leading-[1.05]">
          Únete a Nuestra Historia
        </h2>
        <p class="mt-5 text-xs sm:text-sm text-neutral-600 dark:text-white/60 leading-relaxed">
          Imagina un espacio revolucionado por la elegancia y la funcionalidad. Al unirte a nuestra familia, adquieres no
          solo tecnología de punta, sino también una promesa de excelencia y detalle en tu hogar.
        </p>
        <p class="mt-4 text-xs sm:text-sm text-neutral-600 dark:text-white/60 leading-relaxed">
          Esta es tu oportunidad de vivir la experiencia SJ Electronics.
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <a href="#/productos" class="btn btn-primary">Explorar catálogo</a>
          <a href="#/contacto" class="btn btn-outline dark:border-white/30 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/15">Hablar con ventas</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'

const srcFor = (filename) => `/${encodeURI(String(filename))}`

const heroBackgrounds = computed(() => [
  srcFor('banner 2026-02-07 at 15.10.29.png'),
  srcFor('banner 2026-02-07 at 15.09.20.png'),
  srcFor('banner 2026-02-07 at 15.14.55.png'),
  srcFor('banner 2026-02-07 at 15.16.21.png'),
  srcFor('banner 2026-02-07 at 15.11.01.png')
])

const valueImages = {
  innovacion: srcFor('banner 2026-02-07 at 15.10.29.png'),
  compromiso: srcFor('banner 2026-02-07 at 15.09.20.png'),
  seguridad: srcFor('banner 2026-02-07 at 15.11.01.png'),
}

const mvImages = {
  mision: srcFor('banner 2026-02-07 at 15.14.55.png'),
  vision: srcFor('banner 2026-02-07 at 15.16.21.png'),
}
</script>

