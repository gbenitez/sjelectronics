import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SJInput from '../SJInput.vue'

describe('SJInput', () => {
  it('muestra la etiqueta cuando se pasa label', () => {
    const wrapper = mount(SJInput, {
      props: { id: 'email', label: 'Correo', modelValue: '' }
    })
    expect(wrapper.text()).toContain('Correo')
    expect(wrapper.find('label').attributes('for')).toBe('email')
  })

  it('enlaza modelValue al input y emite update:modelValue al escribir', async () => {
    const wrapper = mount(SJInput, {
      props: { modelValue: '', id: 'n' }
    })
    const input = wrapper.find('input')
    await input.setValue('hola')
    expect(wrapper.emitted('update:modelValue')).toEqual([['hola']])
  })

  it('muestra el mensaje de error y prioriza sobre helperText', () => {
    const wrapper = mount(SJInput, {
      props: {
        modelValue: '',
        id: 'x',
        error: 'Campo obligatorio',
        helperText: 'Ayuda'
      }
    })
    expect(wrapper.text()).toContain('Campo obligatorio')
    expect(wrapper.text()).not.toContain('Ayuda')
  })

  it('muestra helperText cuando no hay error', () => {
    const wrapper = mount(SJInput, {
      props: {
        modelValue: '',
        id: 'y',
        helperText: 'Mínimo 8 caracteres'
      }
    })
    expect(wrapper.text()).toContain('Mínimo 8 caracteres')
  })

  it('respeta type y placeholder', () => {
    const wrapper = mount(SJInput, {
      props: {
        modelValue: '',
        id: 'p',
        type: 'password',
        placeholder: '••••••••'
      }
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
    expect(input.attributes('placeholder')).toBe('••••••••')
  })

  it('marca el input como disabled', () => {
    const wrapper = mount(SJInput, {
      props: { modelValue: '', id: 'd', disabled: true }
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('class')).toContain('cursor-not-allowed')
  })

  it('acepta modelValue numérico', async () => {
    const wrapper = mount(SJInput, {
      props: { modelValue: 0, id: 'q' }
    })
    await wrapper.find('input').setValue('42')
    expect(wrapper.emitted('update:modelValue')).toEqual([['42']])
  })
})
