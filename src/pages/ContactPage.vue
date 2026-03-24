<template>
  <div class="bg-neutral-50 dark:bg-neutral-950">
    <SJHeroSlideshow
      eyebrow="Hablemos"
      title="Contacto"
      subtitle="Cuéntanos qué producto buscas o en qué podemos ayudarte. (Formulario demo)"
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
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <SJCard elevated padding="12">
            <h2 class="text-2xl sm:text-3xl font-display font-bold mb-8">Escríbenos</h2>
            <div class="grid gap-8">
              <div class="grid md:grid-cols-2 gap-6">
                <SJInput id="c-name" v-model="name" label="Nombre" placeholder="Tu nombre" />
                <SJInput id="c-email" v-model="email" label="Email" placeholder="tu@email.com" />
              </div>

              <SJSelect
                id="c-topic"
                v-model="topic"
                label="Tema"
                :options="topics"
                helper-text="Selecciona el tema para responderte más rápido."
              />

              <SJInput
                id="c-message"
                v-model="message"
                label="Mensaje"
                placeholder="Escribe tu mensaje"
                helper-text="Incluye modelo/capacidad si aplica."
              />

              <div class="grid md:grid-cols-2 gap-6">
                <SJSwitch v-model="notify">Quiero notificaciones</SJSwitch>
                <SJCheckbox v-model="accepted">Acepto términos</SJCheckbox>
              </div>

              <div class="flex flex-wrap gap-4 pt-2">
                <SJButton :disabled="!accepted" size="lg">Enviar</SJButton>
                <SJButton variant="outline" size="lg" @click="reset">Limpiar</SJButton>
              </div>
            </div>
          </SJCard>

          <SJCard elevated padding="12">
            <h2 class="text-2xl sm:text-3xl font-display font-bold mb-8">Datos</h2>
            <div class="space-y-3 text-base text-neutral-700 dark:text-white/75">
              <p><span class="font-semibold">Nombre:</span> {{ name || '—' }}</p>
              <p><span class="font-semibold">Email:</span> {{ email || '—' }}</p>
              <p><span class="font-semibold">Tema:</span> {{ topic }}</p>
              <p><span class="font-semibold">Notificaciones:</span> {{ notify ? 'Sí' : 'No' }}</p>
              <p><span class="font-semibold">Acepta términos:</span> {{ accepted ? 'Sí' : 'No' }}</p>
            </div>
          </SJCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SJCard from '../components/SJCard.vue'
import SJInput from '../components/SJInput.vue'
import SJSelect from '../components/SJSelect.vue'
import SJCheckbox from '../components/SJCheckbox.vue'
import SJSwitch from '../components/SJSwitch.vue'
import SJButton from '../components/SJButton.vue'
import SJHeroSlideshow from '../components/SJHeroSlideshow.vue'

const srcFor = (filename) => `/${encodeURI(String(filename))}`

const heroBackgrounds = computed(() => [
  srcFor('banner 2026-02-07 at 15.11.01.png'),
  srcFor('banner 2026-02-07 at 15.15.32.png'),
  srcFor('banner 2026-02-07 at 15.09.20.png'),
  srcFor('banner 2026-02-07 at 15.14.55.png')
])

const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const name = ref('')
const email = ref('')
const message = ref('')
const topic = ref('ventas')
const notify = ref(true)
const accepted = ref(false)

const topics = [
  { value: 'ventas', label: 'Ventas' },
  { value: 'soporte', label: 'Soporte' },
  { value: 'garantia', label: 'Garantía' }
]

const reset = () => {
  name.value = ''
  email.value = ''
  message.value = ''
  topic.value = 'ventas'
  notify.value = true
  accepted.value = false
}
</script>

