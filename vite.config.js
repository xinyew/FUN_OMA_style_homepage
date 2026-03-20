import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow Vite to statically serve images directly from your www.oma.com data dump
      allow: ['/Users/xinye/Downloads/']
    }
  }
})
