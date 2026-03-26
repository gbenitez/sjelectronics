import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SJCheckbox from '../SJCheckbox.vue'

describe('SJCheckbox', () => {
  it('muestra el texto del slot', () => {
    const wrapper = mount(SJCheckbox, {
      props: { modelValue: false },
      slots: { default: 'Acepto términos' }
    })
    expect(wrapper.text()).toContain('Acepto términos')
  })

  it('emite update:modelValue true al pulsar cuando estaba en false', async () => {
    const wrapper = mount(SJCheckbox, {
      props: { modelValue: false },
      slots: { default: 'chk' }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('emite update:modelValue false al pulsar cuando estaba en true', async () => {
    const wrapper = mount(SJCheckbox, {
      props: { modelValue: true },
      slots: { default: 'chk' }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('no emite al pulsar si está disabled', async () => {
    const wrapper = mount(SJCheckbox, {
      props: { modelValue: false, disabled: true },
      slots: { default: 'off' }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('expone aria-pressed acorde a modelValue', () => {
    const on = mount(SJCheckbox, {
      props: { modelValue: true },
      slots: { default: 'x' }
    })
    expect(on.find('button').attributes('aria-pressed')).toBe('true')

    const off = mount(SJCheckbox, {
      props: { modelValue: false },
      slots: { default: 'x' }
    })
    expect(off.find('button').attributes('aria-pressed')).toBe('false')
  })

  it('muestra estado indeterminado en la caja cuando indeterminate es true', () => {
    const wrapper = mount(SJCheckbox, {
      props: { modelValue: false, indeterminate: true },
      slots: { default: 'mix' }
    })
    expect(wrapper.find('button svg').exists()).toBe(true)
  })
})
