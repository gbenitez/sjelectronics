import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Usamos la carpeta /imagen como assets públicos para banners (con espacios en el nombre).
  // Vite los servirá en dev y los copiará al build.
  publicDir: 'imagen',
  server: {
    port: 3000,
    /**
     * En dev, Vite NO ejecuta PHP; solo lo sirve como texto.
     * Este proxy enruta /api/* a un servidor PHP local.
     *
     * Arranca el PHP server con:
     *   npm run dev:php
     */
    proxy: {
      '/api': {
        // Usar IPv4 explícito evita que `localhost` resuelva a ::1 y falle (ECONNREFUSED).
        target: 'http://127.0.0.1:8081',
        changeOrigin: true
      }
    }
  }
})
