import { describe, it, expect } from 'vitest'
import { publicAssetUrl } from '../publicAssetUrl.js'

describe('publicAssetUrl', () => {
  it('devuelve null para vacío', () => {
    expect(publicAssetUrl(null)).toBeNull()
    expect(publicAssetUrl('')).toBeNull()
  })

  it('no altera URLs http(s)', () => {
    expect(publicAssetUrl('https://cdn.test/img.png')).toBe('https://cdn.test/img.png')
  })

  it('resuelve ruta relativa del catálogo (placeholders)', () => {
    const u = publicAssetUrl('placeholders/neveras-1.svg')
    expect(u).toContain('placeholders/neveras-1.svg')
  })

  it('quita barras iniciales duplicadas del path', () => {
    const a = publicAssetUrl('/placeholders/x.svg')
    const b = publicAssetUrl('placeholders/x.svg')
    expect(a).toBe(b)
  })
})
