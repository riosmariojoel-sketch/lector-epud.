import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  base: './', // 👈 ¡ESTA LÍNEA MÁGICA ARREGLA EL ERROR 404 DE LA CONSOLA!
})
