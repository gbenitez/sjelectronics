import { cp, mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('..', import.meta.url)))
const apiDir = join(root, 'api')
const distApi = join(root, 'dist', 'api')
const catalogSrc = join(root, 'src', 'data', 'fallback-catalog.json')
const catalogDest = join(distApi, 'fallback-catalog.json')
const postsSrc = join(root, 'src', 'data', 'fallback-posts.json')
const postsDest = join(distApi, 'fallback-posts.json')

const files = await readdir(apiDir)
const phpFiles = files.filter((f) => f.endsWith('.php'))
if (phpFiles.length === 0) {
  console.warn('copy-api-to-dist: no hay .php en /api')
}
await mkdir(distApi, { recursive: true })
for (const name of phpFiles) {
  await cp(join(apiDir, name), join(distApi, name))
  console.log('copiado api/' + name + ' → dist/api/')
}
await cp(catalogSrc, catalogDest)
console.log('copiado src/data/fallback-catalog.json → dist/api/fallback-catalog.json')
await cp(postsSrc, postsDest)
console.log('copiado src/data/fallback-posts.json → dist/api/fallback-posts.json')
