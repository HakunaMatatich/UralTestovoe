import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

const favoritProxy = {
  '/hsprice': {
    target: 'http://api.favorit-parts.ru',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/hsprice/, '/hs/hsprice'),
  },
}

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: favoritProxy,
  },
  preview: {
    proxy: favoritProxy,
  },
})
