import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ works for static hosting (GitHub Pages, etc.)
  build: {
    outDir: "dist",
    target: "esnext",
    minify: "esbuild",
    chunkSizeWarningLimit: 1000, // ✅ prevent chunk size warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ✅ Automatically split vendor libraries for faster loading
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('axios')) return 'axios-vendor'
            if (id.includes('react-router')) return 'router-vendor'
            return 'vendor'
          }
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    force: true, // ✅ ensures re-optimization if deps change
  },
  resolve: {
    dedupe: ['react', 'react-dom'], // ✅ prevents duplicate React instances
  }
})
