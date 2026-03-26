import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useHashRoute } from '../useHashRoute.js'

const HashProbe = defineComponent({
  setup() {
    const { path, fullPath, setPath } = useHashRoute()
    return { path, fullPath, setPath }
  },
  template: `
    <div>
      <span data-testid="path">{{ path }}</span>
      <span data-testid="full">{{ fullPath }}</span>
      <button type="button" data-testid="go" @click="setPath('/productos')">go</button>
    </div>
  `
})

describe('useHashRoute', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    window.location.hash = '#/'
  })

  it('normaliza path sin query cuando el hash incluye query string', async () => {
    window.location.hash = '#/catalogo?orden=precio'
    wrapper = mount(HashProbe)
    await nextTick()
    expect(wrapper.find('[data-testid="path"]').text()).toBe('/catalogo')
    expect(wrapper.find('[data-testid="full"]').text()).toBe('/catalogo?orden=precio')
  })

  it('expone path "/" cuando el hash es solo #', async () => {
    window.location.hash = '#'
    wrapper = mount(HashProbe)
    await nextTick()
    expect(wrapper.find('[data-testid="path"]').text()).toBe('/')
  })

  it('setPath actualiza el hash y el path reactivo', async () => {
    window.location.hash = '#/'
    wrapper = mount(HashProbe)
    await nextTick()
    await wrapper.find('[data-testid="go"]').trigger('click')
    await nextTick()
    expect(window.location.hash).toBe('#/productos')
    // jsdom no siempre dispara `hashchange` al asignar `location.hash`; el navegador sí.
    window.dispatchEvent(new Event('hashchange'))
    await nextTick()
    expect(wrapper.find('[data-testid="path"]').text()).toBe('/productos')
  })

  it('actualiza path cuando se dispara hashchange', async () => {
    window.location.hash = '#/'
    wrapper = mount(HashProbe)
    await nextTick()
    window.location.hash = '#/contacto'
    window.dispatchEvent(new Event('hashchange'))
    await nextTick()
    expect(wrapper.find('[data-testid="path"]').text()).toBe('/contacto')
  })

  it('setPath usa "/" cuando se pasa cadena vacía', async () => {
    window.location.hash = '#/algo'
    wrapper = mount(HashProbe)
    await nextTick()
    wrapper.vm.setPath('')
    await nextTick()
    expect(window.location.hash).toBe('#/')
  })
})
