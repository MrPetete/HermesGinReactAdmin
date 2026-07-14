import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend runs inside WSL2. Windows-side 127.0.0.1 does NOT reach the WSL guest,
// so proxy to the WSL IP. Override with env VITE_API_HOST if your WSL IP changes.
const apiHost = process.env.VITE_API_HOST || '172.26.236.191'

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
