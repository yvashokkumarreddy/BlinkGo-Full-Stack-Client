import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: "dist",
    target: "esnext", 
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  optimizeDeps: {
    force: true, 
  },
  resolve: {
    dedupe: ['react', 'react-dom'], 
  }
})
