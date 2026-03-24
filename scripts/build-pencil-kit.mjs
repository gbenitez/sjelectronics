import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const INPUT = path.join(ROOT, 'design-system.json')
const OUT_DIR = path.join(ROOT, 'pencil-export')
const OUT_JSON = path.join(OUT_DIR, 'pencil-kit.json')

function isObj(v) {
  return v && typeof v === 'object' && !Array.isArray(v)
}

function flattenTokens(node, prefix = '', out = {}) {
  if (!isObj(node)) return out
  if (Object.prototype.hasOwnProperty.call(node, 'value') && (typeof node.value !== 'object' || node.value === null)) {
    out[prefix] = node.value
    return out
  }
  for (const [k, v] of Object.entries(node)) {
    const next = prefix ? `${prefix}.${k}` : k
    if (isObj(v) && Object.prototype.hasOwnProperty.call(v, 'value') && (typeof v.value !== 'object' || v.value === null)) {
      out[next] = v.value
    } else if (isObj(v)) {
      flattenTokens(v, next, out)
    }
  }
  return out
}

function resolveColorToken(ref, flat) {
  if (!ref) return null
  if (typeof ref !== 'string') return ref

  const s = ref.trim()
  if (!s) return s
  if (s === 'transparent') return 'transparent'
  if (s.startsWith('#') || s.startsWith('rgba(') || s.startsWith('rgb(')) return s

  const mappings = [
    ['brand.', 'color.brand.'],
    ['neutral.', 'color.neutral.'],
    ['text.', 'color.semantic.text.'],
    ['bg.', 'color.semantic.bg.'],
    ['border.', 'color.semantic.border.'],
    ['interactive.', 'color.semantic.interactive.'],
    ['status.', 'color.semantic.status.'],
    ['focusRing.', 'color.focusRing.'],
  ]

  let key = s
  for (const [from, to] of mappings) {
    if (s.startsWith(from)) {
      key = to + s.slice(from.length)
      break
    }
  }

  // Si ya viene como "color.xxx", úsalo tal cual.
  if (s.startsWith('color.')) key = s

  const v = flat[key]
  return v ?? s
}

function resolveTypography(textStyles, flat) {
  // Convierte textStyles (h1/h2/...) en tamaños px concretos.
  // En tu JSON: typography.textStyles.*.fontSize = "4xl" (referencia a typography.scale.*)
  const out = {}
  for (const [name, style] of Object.entries(textStyles || {})) {
    if (!isObj(style)) continue
    const fontFamilyKey = style.fontFamily ? `typography.fontFamily.${style.fontFamily}` : null
    const fontFamily = fontFamilyKey ? flat[fontFamilyKey] : null

    const sizeKey = style.fontSize ? `typography.scale.${style.fontSize}.fontSize` : null
    const lineHeightKey =
      style.fontSize ? `typography.scale.${style.fontSize}.lineHeight` : null

    const fontSizePx = sizeKey ? flat[sizeKey] : null
    const lineHeightPx = lineHeightKey ? flat[lineHeightKey] : null

    const fontWeightKey = style.fontWeight ? `typography.fontWeight.${style.fontWeight}` : null
    const fontWeight = fontWeightKey ? flat[fontWeightKey] : null

    const letterSpacingKey = style.letterSpacing ? `typography.letterSpacing.${style.letterSpacing}` : null
    const letterSpacingEm = letterSpacingKey ? flat[letterSpacingKey] : null

    out[name] = {
      fontFamily,
      fontSizePx,
      lineHeightPx,
      fontWeight,
      letterSpacingEm,
      textTransform: style.textTransform ?? null,
    }
  }
  return out
}

function buildThemes(flat) {
  // Theme light: semantic tokens base.
  // Theme dark: para cada semantic token, si existe su equivalente en modes.dark, usarlo.
  const light = {}
  const dark = {}

  for (const [k, v] of Object.entries(flat)) {
    if (!k.startsWith('color.semantic.')) continue
    if (k.startsWith('color.semantic.modes.dark.')) continue
    light[k] = v

    const suffix = k.slice('color.semantic.'.length)
    const dk = `color.semantic.modes.dark.${suffix}`
    dark[k] = flat[dk] ?? v
  }

  // También incluimos focusRing base (sirve en ambos).
  for (const k of ['color.focusRing.color', 'color.focusRing.width', 'color.focusRing.offset']) {
    if (k in flat) {
      light[k] = flat[k]
      dark[k] = flat[k]
    }
  }

  return { light, dark }
}

function pickByPrefix(flat, prefix) {
  return Object.fromEntries(Object.entries(flat).filter(([k]) => k.startsWith(prefix)))
}

const raw = JSON.parse(await fs.readFile(INPUT, 'utf8'))
const tokens = raw?.tokens
const components = raw?.components

if (!tokens || !components) {
  console.error('Falta `tokens` o `components` en design-system.json')
  process.exit(1)
}

const flat = flattenTokens(tokens)
const themes = buildThemes(flat)

// Resolver “recetas” de componentes base para Pencil.
const button = components?.Button
const input = components?.Input

const kit = {
  meta: raw?.meta ?? null,
  exportedAt: new Date().toISOString(),
  variables: {
    // Variables “crudas” que más usarás en Pencil:
    colors: pickByPrefix(flat, 'color.'),
    spacing: pickByPrefix(flat, 'spacing.'),
    radius: pickByPrefix(flat, 'radius.'),
    shadow: pickByPrefix(flat, 'shadow.'),
    typography: pickByPrefix(flat, 'typography.'),
  },
  themes,
  textStyles: resolveTypography(tokens?.typography?.textStyles, flat),
  components: {
    Button: button
      ? {
          description: button.description ?? null,
          sizes: button.sizes ?? null,
          styling: button.styling ?? null,
          variantsResolved: Object.fromEntries(
            Object.entries(button.variants || {}).map(([name, v]) => [
              name,
              {
                bg: resolveColorToken(v?.bg, flat),
                fg: resolveColorToken(v?.fg, flat),
                border: resolveColorToken(v?.border, flat),
                states: v?.states
                  ? Object.fromEntries(
                      Object.entries(v.states).map(([stateName, state]) => [
                        stateName,
                        Object.fromEntries(
                          Object.entries(state || {}).map(([k, val]) => [k, resolveColorToken(val, flat)]),
                        ),
                      ]),
                    )
                  : null,
              },
            ]),
          ),
        }
      : null,
    Input: input
      ? {
          description: input.description ?? null,
          sizes: input.sizes ?? null,
          styling: input.styling ?? null,
        }
      : null,
  },
}

await fs.mkdir(OUT_DIR, { recursive: true })
await fs.writeFile(OUT_JSON, JSON.stringify(kit, null, 2), 'utf8')
console.log(`OK: generado ${path.relative(ROOT, OUT_JSON)}`)

