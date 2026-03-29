/**
 * Arranca PHP en 127.0.0.1:8081 y Vite (proxy /api → PHP).
 * Ctrl+C termina ambos.
 */
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const isWin = process.platform === 'win32'
const viteJs = join(root, 'node_modules', 'vite', 'bin', 'vite.js')

/**
 * PHP no lee .env por sí solo; inyectamos WP_* al proceso para que getenv() funcione en dev.
 */
function loadDotEnv(dir) {
  const p = join(dir, '.env')
  if (!existsSync(p)) return {}
  const out = {}
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq <= 0) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"')
    }
    out[key] = val
  }
  return out
}

const php = spawn('php', ['-S', '127.0.0.1:8081', '-t', '.'], {
  cwd: root,
  stdio: 'inherit',
  shell: isWin,
  env: { ...process.env, ...loadDotEnv(root) },
})

let vite = null

php.on('error', (err) => {
  console.error('\n→ No se pudo iniciar `php`. Instálalo y añádelo al PATH, o usa solo `npm run dev` (fallback local sin API).')
  console.error(`   ${err.message}`)
  process.exit(1)
})

php.on('exit', (code, signal) => {
  if (vite && !vite.killed) vite.kill('SIGTERM')
  if (signal !== 'SIGTERM' && code && code !== 0) {
    process.exit(code)
  }
})

function startVite() {
  if (!existsSync(viteJs)) {
    console.error('No se encontró Vite en node_modules. Ejecuta npm install.')
    php.kill('SIGTERM')
    process.exit(1)
  }
  vite = spawn(process.execPath, [viteJs], {
    cwd: root,
    stdio: 'inherit',
  })
  vite.on('exit', (code) => {
    php.kill('SIGTERM')
    process.exit(code ?? 0)
  })
  vite.on('error', (err) => {
    console.error(err)
    php.kill('SIGTERM')
    process.exit(1)
  })
}

const delay = setTimeout(startVite, 350)

function shutdown() {
  clearTimeout(delay)
  if (vite && !vite.killed) vite.kill('SIGTERM')
  php.kill('SIGTERM')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
