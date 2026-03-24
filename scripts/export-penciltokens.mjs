import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const INPUT = path.join(ROOT, 'design-system.json')
const OUT_DIR = path.join(ROOT, 'pencil-export')

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v)
}

function flattenTokens(node, prefix = '', out = {}) {
  if (Array.isArray(node)) {
    out[prefix] = node
    return out
  }

  if (!isPlainObject(node)) {
    out[prefix] = node
    return out
  }

  // Caso común en este design system: { value: ... , usage: ... }
  if (Object.prototype.hasOwnProperty.call(node, 'value') && (typeof node.value !== 'object' || node.value === null)) {
    out[prefix] = node.value
    return out
  }

  for (const [k, v] of Object.entries(node)) {
    const next = prefix ? `${prefix}.${k}` : k
    flattenTokens(v, next, out)
  }
  return out
}

function toCssVarName(key) {
  // key tipo: "color.brand.primary.600" => "--sj-color-brand-primary-600"
  return `--sj-${key.replaceAll('.', '-')}`
}

function cssLine(key, value) {
  // CSS variables: dejamos el value tal cual (hex, rgba, shadow string, etc.)
  // Para números, los exportamos como número sin unidad para que tú decidas en Pencil/CSS.
  const v = typeof value === 'string' ? value : String(value)
  return `  ${toCssVarName(key)}: ${v};`
}

const raw = JSON.parse(await fs.readFile(INPUT, 'utf8'))
const tokens = raw?.tokens
if (!tokens || typeof tokens !== 'object') {
  console.error('No se encontró raw.tokens en design-system.json')
  process.exit(1)
}

await fs.mkdir(OUT_DIR, { recursive: true })

// Aplanado completo (útil para mapear a variables de Pencil).
const flat = flattenTokens(tokens)
await fs.writeFile(
  path.join(OUT_DIR, 'tokens.flat.json'),
  JSON.stringify(
    {
      meta: raw?.meta ?? null,
      exportedAt: new Date().toISOString(),
      tokens: flat,
    },
    null,
    2,
  ),
  'utf8',
)

// Export CSS variables para los grupos más útiles en diseño.
const allowPrefixes = ['color.', 'spacing.', 'radius.', 'shadow.']
const cssKeys = Object.keys(flat)
  .filter((k) => allowPrefixes.some((p) => k.startsWith(p)))
  .sort((a, b) => a.localeCompare(b))

const css = [
  '/* Auto-generado desde design-system.json */',
  '/* Ejecuta: node scripts/export-penciltokens.mjs */',
  ':root {',
  ...cssKeys.map((k) => cssLine(k, flat[k])),
  '}',
  '',
]
await fs.writeFile(path.join(OUT_DIR, 'tokens.css'), css.join('\n'), 'utf8')

// Exports separados (por si quieres importar por categorías en Pencil).
const pick = (prefix) => Object.fromEntries(Object.entries(flat).filter(([k]) => k.startsWith(prefix)))
await fs.writeFile(path.join(OUT_DIR, 'tokens.colors.json'), JSON.stringify(pick('color.'), null, 2), 'utf8')
await fs.writeFile(path.join(OUT_DIR, 'tokens.spacing.json'), JSON.stringify(pick('spacing.'), null, 2), 'utf8')
await fs.writeFile(path.join(OUT_DIR, 'tokens.radius.json'), JSON.stringify(pick('radius.'), null, 2), 'utf8')
await fs.writeFile(path.join(OUT_DIR, 'tokens.shadow.json'), JSON.stringify(pick('shadow.'), null, 2), 'utf8')

console.log(`OK: exportado a ${path.relative(ROOT, OUT_DIR)}/`)

