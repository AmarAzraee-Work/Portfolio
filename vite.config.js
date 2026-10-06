import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Inside Docker on macOS, file change events from the mounted folder can be missed; polling catches them.
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
