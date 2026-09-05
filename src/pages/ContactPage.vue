<template>
  <div class="bg-white dark:bg-sj-black text-neutral-900 dark:text-white">
    <SJHeroSlideshow
      eyebrow="Hablemos"
      title="Contacto"
      subtitle="Cuéntanos qué producto buscas o en qué podemos ayudarte."
      :backgrounds="heroBackgrounds"
      :interval-ms="3600"
    >
      <template #ctas>
        <button type="button" class="btn btn-primary" @click="scrollToId('contact-form')">Escríbenos</button>
        <a href="#/productos" class="btn btn-outline border-white/30 text-white hover:bg-white/10 active:bg-white/15">Ver productos</a>
      </template>
    </SJHeroSlideshow>

    <section class="py-14 sm:py-16 lg:py-20">
      <div id="contact-form" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <!-- Formulario -->
          <div class="lg:col-span-7 border border-neutral-200 dark:border-white/10 p-6 sm:p-8">
            <h2 class="text-2xl sm:text-3xl font-display font-bold">Escríbenos</h2>
            <p class="mt-2 text-sm text-neutral-600 dark:text-white/60">
              Completa el formulario y te contactamos por WhatsApp con tu mensaje ya listo.
            </p>

            <form class="mt-8 grid gap-6" novalidate @submit.prevent="onSubmit">
              <div class="grid sm:grid-cols-2 gap-6">
                <SJInput
                  id="c-name"
                  v-model="form.name"
                  label="Nombre"
                  placeholder="Tu nombre"
                  :error="errors.name"
                />
                <SJInput
                  id="c-email"
                  v-model="form.email"
                  type="email"
                  label="Email"
                  placeholder="tu@email.com"
                  :error="errors.email"
                />
              </div>

              <SJInput
                id="c-phone"
                v-model="form.phone"
                type="tel"
                label="Teléfono (opcional)"
                placeholder="0412 123 4567"
                :error="errors.phone"
              />

              <SJSelect
                id="c-topic"
                v-model="form.topic"
                label="Asunto"
                :options="topics"
                helper-text="Selecciona el tema para responderte más rápido."
              />

              <div class="space-y-1">
                <label for="c-message" class="block text-sm font-medium text-neutral-700 dark:text-white/80">
                  Mensaje
                </label>
                <textarea
                  id="c-message"
                  v-model="form.message"
                  rows="4"
                  placeholder="Cuéntanos qué producto buscas o en qué podemos ayudarte. Incluye modelo/capacidad si aplica."
                  class="w-full px-3 py-2.5 rounded-md border bg-white text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-3 focus:ring-brand-primary-500/35 focus:ring-offset-2 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:border-white/10"
                  :class="errors.message ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 focus:border-brand-primary-500'"
                  :aria-invalid="errors.message ? 'true' : undefined"
                  :aria-describedby="errors.message ? 'c-message-error' : undefined"
                />
                <p v-if="errors.message" id="c-message-error" class="text-sm text-red-700 dark:text-red-400">{{ errors.message }}</p>
              </div>

              <div v-if="status === 'success'" class="flex items-start gap-3 border border-neutral-900 dark:border-white px-4 py-3 text-sm text-neutral-900 dark:text-white">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5 shrink-0 mt-0.5"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Tu mensaje quedó listo. Se abrió WhatsApp para que lo envíes directamente.</span>
              </div>
              <div v-else-if="status === 'error'" class="border border-red-300 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-300">
                Revisa los campos marcados antes de continuar.
              </div>

              <div class="flex flex-wrap gap-4 pt-2">
                <SJButton type="submit" size="lg" :disabled="status === 'submitting'">
                  {{ status === 'submitting' ? 'Preparando…' : 'Enviar por WhatsApp' }}
                </SJButton>
                <SJButton type="button" variant="outline" size="lg" @click="reset">Limpiar</SJButton>
              </div>
            </form>
          </div>

          <!-- Datos -->
          <div class="lg:col-span-5 grid gap-6">
            <div class="border border-neutral-200 dark:border-white/10 p-6 sm:p-8">
              <h2 class="text-xl font-display font-bold">Datos de contacto</h2>
              <ul class="mt-5 space-y-4 text-sm">
                <li class="flex items-start gap-3">
                  <span class="mt-0.5 h-5 w-5 shrink-0 text-brand-primary-600 dark:text-brand-primary-500">
                    <svg viewBox="0 0 24 24" fill="none" class="h-full w-full"><path d="M12 4a8 8 0 0 0-7 12.1L4 20l4-1a8 8 0 1 0 4-15Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  </span>
                  <div>
                    <div class="font-semibold text-neutral-900 dark:text-white">WhatsApp</div>
                    <a :href="whatsappHref" target="_blank" rel="noreferrer" class="text-neutral-600 dark:text-white/65 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition">
                      Escríbenos directamente
                    </a>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-0.5 h-5 w-5 shrink-0 text-brand-primary-600 dark:text-brand-primary-500">
                    <svg viewBox="0 0 24 24" fill="none" class="h-full w-full"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>
                  </span>
                  <div>
                    <div class="font-semibold text-neutral-900 dark:text-white">Instagram</div>
                    <a href="https://instagram.com/sj_electronics" target="_blank" rel="noreferrer" class="text-neutral-600 dark:text-white/65 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition">
                      @sj_electronics
                    </a>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-0.5 h-5 w-5 shrink-0 text-neutral-400 dark:text-white/30">
                    <svg viewBox="0 0 24 24" fill="none" class="h-full w-full"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                  </span>
                  <div>
                    <div class="font-semibold text-neutral-900 dark:text-white">Horario de atención</div>
                    <!-- TODO: reemplazar con horario real cuando esté confirmado -->
                    <span class="text-neutral-500 dark:text-white/45">Próximamente</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-0.5 h-5 w-5 shrink-0 text-neutral-400 dark:text-white/30">
                    <svg viewBox="0 0 24 24" fill="none" class="h-full w-full"><path d="M4 6h16v12H4z" stroke="currentColor" stroke-width="1.6"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </span>
                  <div>
                    <div class="font-semibold text-neutral-900 dark:text-white">Correo</div>
                    <!-- TODO: reemplazar con correo real cuando esté confirmado -->
                    <span class="text-neutral-500 dark:text-white/45">Próximamente</span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="border border-neutral-200 dark:border-white/10 p-6 sm:p-8">
              <h2 class="text-xl font-display font-bold">¿Dónde comprar?</h2>
              <p class="mt-3 text-sm text-neutral-600 dark:text-white/65 leading-relaxed">
                Contamos con distribuidores en todo el país. Escríbenos por WhatsApp o Instagram y te
                ayudamos a encontrar el punto de venta más cercano.
              </p>
              <!-- TODO: listado de distribuidores / mapa cuando haya direcciones confirmadas -->
              <a :href="whatsappHref" target="_blank" rel="noreferrer" class="btn btn-primary mt-5">
                Consultar distribuidores
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import SJInput from '../components/SJInput.vue'
import SJSelect from '../components/SJSelect.vue'
import SJButton from '../components/SJButton.vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'
import { usePageMeta } from '../composables/usePageMeta'
import { whatsappLink } from '../config/whatsapp'

usePageMeta({
  title: 'Contacto',
  description: 'Escríbenos por WhatsApp o Instagram. Distribuidores SJ Electronics en todo el país.',
  path: '/contacto',
})

const srcFor = (filename) => `/${encodeURI(String(filename))}`

const heroBackgrounds = computed(() => [
  srcFor('site/hero-desk-01.jpg'),
  srcFor('site/hero-desk-02.jpg'),
  srcFor('site/hero-mobile-01.jpg'),
  srcFor('site/hero-mobile-02.jpg'),
])

const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const topics = [
  { value: 'ventas', label: 'Ventas' },
  { value: 'soporte', label: 'Soporte' },
  { value: 'garantia', label: 'Garantía' },
  { value: 'repuestos', label: 'Repuestos' },
]

const form = reactive({ name: '', email: '', phone: '', topic: 'ventas', message: '' })
const errors = reactive({ name: '', email: '', phone: '', message: '' })
const status = ref('idle') // idle | submitting | success | error
const attempted = ref(false)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+()\s-]{7,20}$/

const validate = () => {
  errors.name = form.name.trim().length >= 2 ? '' : 'Escribe tu nombre completo.'
  errors.email = EMAIL_RE.test(form.email.trim()) ? '' : 'Escribe un email válido.'
  errors.phone = !form.phone.trim() || PHONE_RE.test(form.phone.trim()) ? '' : 'Escribe un teléfono válido.'
  errors.message = form.message.trim().length >= 10 ? '' : 'Cuéntanos con un poco más de detalle (mín. 10 caracteres).'
  return !errors.name && !errors.email && !errors.phone && !errors.message
}

// Tras el primer intento de envío, revalida en vivo mientras el usuario corrige los campos.
watch(form, () => {
  if (!attempted.value) return
  const isValid = validate()
  if (isValid && status.value === 'error') status.value = 'idle'
}, { deep: true })

const topicLabel = computed(() => topics.find((t) => t.value === form.topic)?.label || form.topic)

const whatsappHref = computed(() => whatsappLink('Hola SJ Electronics, quisiera más información sobre sus productos.'))

const onSubmit = async () => {
  attempted.value = true
  if (!validate()) {
    status.value = 'error'
    return
  }

  status.value = 'submitting'
  // No hay backend de correo configurado (api/contact.php): el mensaje se entrega por WhatsApp,
  // que es el canal de contacto real del sitio. TODO: sustituir por envío a servidor si se habilita.
  const lines = [
    `Nombre: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    form.phone.trim() ? `Teléfono: ${form.phone.trim()}` : null,
    `Asunto: ${topicLabel.value}`,
    `Mensaje: ${form.message.trim()}`,
  ].filter(Boolean)

  await new Promise((resolve) => setTimeout(resolve, 350))
  window.open(whatsappLink(lines.join('\n')), '_blank', 'noreferrer')
  status.value = 'success'
}

const reset = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.topic = 'ventas'
  form.message = ''
  errors.name = errors.email = errors.phone = errors.message = ''
  attempted.value = false
  status.value = 'idle'
}
</script>
