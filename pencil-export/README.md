## Exportar `design-system.json` para usar en Pencil

Pencil no “importa” este `design-system.json` directamente. La forma práctica es **convertir tokens** a:

- **JSON aplanado** (para crear variables en Pencil)
- **CSS variables** (para referencia rápida de valores)

### 1) Generar exports

Desde la raíz del proyecto:

```bash
node scripts/export-penciltokens.mjs
```

Se crearán estos archivos:

- `pencil-export/tokens.flat.json` (todos los tokens en formato `key -> value`)
- `pencil-export/tokens.css` (CSS variables para color/spacing/radius/shadow)
- `pencil-export/tokens.colors.json`
- `pencil-export/tokens.spacing.json`
- `pencil-export/tokens.radius.json`
- `pencil-export/tokens.shadow.json`

### 2) Cómo “usarlo” en Pencil (mapeo recomendado)

- **Colores**: crea variables/paletas usando keys como `color.brand.primary.600` → valor `#...`
- **Spacing**: variables para paddings/gaps usando `spacing.4` → `16`
- **Radius**: variables para bordes `radius.lg` → `14`
- **Shadow**: estilos de sombra `shadow.md` → `0 4px 6px ...`

Tip: empieza importando **solo color + radius + shadow**, y luego spacing.

