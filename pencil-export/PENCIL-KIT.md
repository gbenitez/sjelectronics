## Pencil kit (tokens + componentes base)

Este proyecto ya tiene `design-system.json` con:
- `tokens` (colores, spacing, radius, shadow, tipografía, etc.)
- `components` (specs para Button, Input, etc.)

Como Pencil no importa directamente ese JSON, este kit genera un **bundle** para crear:
- Variables (tokens)
- Themes (light/dark)
- Text styles
- Recetas de componentes (ej: Button variants/sizes)

### 1) Generar el kit

```bash
node scripts/build-pencil-kit.mjs
```

Salida:
- `pencil-export/pencil-kit.json`

### 2) Qué hacer dentro de Pencil (rápido)

1. Crea un documento `.pen` nuevo.
2. En el panel de **Variables** (o equivalente):
   - Crea grupos: `color`, `spacing`, `radius`, `shadow`, `typography`.
   - Copia/pega valores desde `pencil-kit.json → variables.*`.
3. Crea **Themes**:
   - `light`: usa `pencil-kit.json → themes.light`
   - `dark`: usa `pencil-kit.json → themes.dark`
4. Crea **Text styles**:
   - Usa `pencil-kit.json → textStyles` (h1/h2/body/caption/overline…)
5. Construye componentes base:
   - **Button**: usa `pencil-kit.json → components.Button` (sizes + variantsResolved)
   - **Input**: usa `pencil-kit.json → components.Input`

### Nota importante (automatización total)

Para que quede “armado automáticamente” *dentro* de Pencil (crear variables y componentes sin hacerlo a mano),
necesito operar sobre un `.pen` usando el editor de Pencil.
Si quieres, dime “créalo en Pencil” y lo genero en un `.pen` nuevo en tu workspace.

