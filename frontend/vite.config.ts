import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8000', // backend url
        ws: true,
      },
    },
  },
})
