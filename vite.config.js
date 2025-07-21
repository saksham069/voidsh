import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src/renderer',
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/renderer/index.html')
    }
  }
})
