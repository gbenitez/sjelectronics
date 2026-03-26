import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SJButton from '../SJButton.vue'

describe('SJButton', () => {
  it('renderiza el texto del slot', () => {
    const wrapper = mount(SJButton, { slots: { default: 'Guardar' } })
    expect(wrapper.text()).toContain('Guardar')
  })

  it('aplica clase de variante primary por defecto', () => {
    const wrapper = mount(SJButton, { slots: { default: 'OK' } })
    expect(wrapper.attributes('class')).toContain('bg-brand-primary-600')
  })

  it('aplica clase de variante outline cuando se pasa variant outline', () => {
    const wrapper = mount(SJButton, {
      props: { variant: 'outline' },
      slots: { default: 'Cancelar' }
    })
    expect(wrapper.attributes('class')).toContain('border-2')
    expect(wrapper.attributes('class')).toContain('border-neutral-300')
  })

  it('deshabilita el botón y emite disabled en el DOM', () => {
    const wrapper = mount(SJButton, {
      props: { disabled: true },
      slots: { default: 'Enviar' }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emite click al pulsar cuando no está deshabilitado', async () => {
    const wrapper = mount(SJButton, { slots: { default: 'Pulsar' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('no emite click cuando está deshabilitado', async () => {
    const wrapper = mount(SJButton, {
      props: { disabled: true },
      slots: { default: 'No' }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('aplica tamaño lg cuando size es lg', () => {
    const wrapper = mount(SJButton, {
      props: { size: 'lg' },
      slots: { default: 'Grande' }
    })
    expect(wrapper.attributes('class')).toContain('text-lg')
  })
})
