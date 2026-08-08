<template>
  <footer class="bg-sj-black text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        <div>
          <img
            :src="logoWhite"
            alt="SJ Electronics - Más cerca de ti"
            class="h-10 w-auto min-w-[120px]"
            loading="lazy"
          />
          <p class="text-white/70 text-base mt-5 leading-relaxed max-w-sm">
            Electrodomésticos para el hogar y la cocina. <span class="text-white font-semibold">Más cerca de ti.</span>
          </p>
          <div class="flex items-center gap-3 mt-6">
            <a
              href="https://instagram.com/sj_electronics"
              target="_blank"
              rel="noreferrer"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-brand-primary-500 hover:text-brand-primary-400 transition focus-ring"
              aria-label="SJ Electronics en Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6" />
                <circle cx="17" cy="7" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h5 class="text-xs font-semibold uppercase tracking-[0.14em] text-white/85 mb-5">Atención al cliente</h5>
          <ul class="space-y-3 text-base text-white/70">
            <li><a href="#/contacto" class="hover:text-brand-primary-400 transition-colors">Contacto</a></li>
            <li><a href="#/contacto" class="hover:text-brand-primary-400 transition-colors">Envíos</a></li>
            <li><a href="#/contacto" class="hover:text-brand-primary-400 transition-colors">Garantía</a></li>
          </ul>
        </div>

        <div>
          <h5 class="text-xs font-semibold uppercase tracking-[0.14em] text-white/85 mb-5">Tienda</h5>
          <ul class="space-y-3 text-base text-white/70">
            <li><a href="#/productos" class="hover:text-brand-primary-400 transition-colors">Catálogo</a></li>
            <li><a href="#/productos" class="hover:text-brand-primary-400 transition-colors">Ofertas</a></li>
            <li><a href="#/posts" class="hover:text-brand-primary-400 transition-colors">Novedades</a></li>
          </ul>
        </div>

        <div>
          <h5 class="text-xs font-semibold uppercase tracking-[0.14em] text-white/85 mb-5">Empresa</h5>
          <ul class="space-y-3 text-base text-white/70">
            <li><a href="#/quienes-somos" class="hover:text-brand-primary-400 transition-colors">Quiénes somos</a></li>
            <li><a href="#/posts" class="hover:text-brand-primary-400 transition-colors">Posts</a></li>
            <li><a href="#/contacto" class="hover:text-brand-primary-400 transition-colors">Privacidad</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-14 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-base text-white/60">
        <p>© 2026 SJ Electronics. Todos los derechos reservados.</p>
        <p class="text-white/50">Distribución nacional · Garantía · Asesoría · Repuestos</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// `imagen/` es `publicDir`, así que se sirve desde la raíz y NO se debe importar.
const logoWhite = `/${encodeURI('Logotipo-white-sin-fondo (1).png')}`
</script>

