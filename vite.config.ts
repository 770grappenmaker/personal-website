import { fileURLToPath, URL } from 'node:url'
import { dirname, resolve } from 'node:path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      "/wg-backend": {
        target: "https://koenoostveen.nl/wg",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/wg-backend/, '')
      },
      "/pnet": {
        target: "https://koenoostveen.nl/pnet",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pnet/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        wg: resolve(import.meta.dirname, 'wg-web/index.html'),
      }
    }
  }
})
