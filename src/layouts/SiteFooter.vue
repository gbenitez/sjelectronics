<template>
  <footer class="bg-neutral-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        <div>
          <img
            :src="logoWhite"
            alt="SJ Electronics - Más cerca de ti"
            class="h-10 w-auto"
            loading="lazy"
          />
          <p class="text-white/70 text-base mt-5 leading-relaxed max-w-sm">
            Electrodomésticos y electrónica para el hogar. Más cerca de ti.
          </p>
        </div>

        <div>
          <h5 class="text-xs font-semibold uppercase tracking-wide text-white/85 mb-5">Atención al cliente</h5>
          <ul class="space-y-3 text-base text-white/70">
            <li><a href="#/contacto" class="hover:text-white transition-colors">Contacto</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Envíos</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Garantía</a></li>
          </ul>
        </div>

        <div>
          <h5 class="text-xs font-semibold uppercase tracking-wide text-white/85 mb-5">Tienda</h5>
          <ul class="space-y-3 text-base text-white/70">
            <li><a href="#/productos" class="hover:text-white transition-colors">Catálogo</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Ofertas</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Novedades</a></li>
          </ul>
        </div>

        <div>
          <h5 class="text-xs font-semibold uppercase tracking-wide text-white/85 mb-5">Empresa</h5>
          <ul class="space-y-3 text-base text-white/70">
            <li><a href="#/quienes-somos" class="hover:text-white transition-colors">Quiénes somos</a></li>
            <li><a href="#/componentes" class="hover:text-white transition-colors">Sistema de componentes</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Privacidad</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-14 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-base text-white/60">
        <p>© 2026 SJ Electronics. Todos los derechos reservados.</p>
        <p class="text-white/50">Hecho con foco en legibilidad y accesibilidad.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// `imagen/` es `publicDir`, así que se sirve desde la raíz y NO se debe importar.
const logoWhite = `/${encodeURI('Logotipo-white-sin-fondo (1).png')}`
</script>

