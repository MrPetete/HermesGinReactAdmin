import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend runs as a native Windows process on localhost:8080 (pure-Go sqlite, no WSL).
// Override with env VITE_API_HOST if you move it elsewhere.
const apiHost = process.env.VITE_API_HOST || '127.0.0.1'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: `http://${apiHost}:8080`,
        changeOrigin: true,
      },
    },
  },
})
