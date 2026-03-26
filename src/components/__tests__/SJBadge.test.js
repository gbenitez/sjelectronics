import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SJBadge from '../SJBadge.vue'

describe('SJBadge', () => {
  it('renderiza el contenido del slot', () => {
    const wrapper = mount(SJBadge, { slots: { default: 'Nuevo' } })
    expect(wrapper.text()).toBe('Nuevo')
  })

  it('usa estilos neutral por defecto', () => {
    const wrapper = mount(SJBadge, { slots: { default: 'x' } })
    expect(wrapper.attributes('class')).toContain('bg-neutral-100')
    expect(wrapper.attributes('class')).toContain('text-neutral-700')
  })

  it('aplica variante promo', () => {
    const wrapper = mount(SJBadge, {
      props: { variant: 'promo' },
      slots: { default: 'Oferta' }
    })
    expect(wrapper.attributes('class')).toContain('bg-brand-primary-600')
  })

  it('aplica variante new', () => {
    const wrapper = mount(SJBadge, {
      props: { variant: 'new' },
      slots: { default: 'New' }
    })
    expect(wrapper.attributes('class')).toContain('bg-brand-secondary-600')
  })
})
