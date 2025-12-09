import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Target modern browsers for smaller bundle
    target: 'es2020',
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Report compressed size
    reportCompressedSize: true,
    
    // Enable CSS minification
    cssMinify: true
  },
  
  server: {
    port: 5173,
    strictPort: false,
    host: true
  },
  
  preview: {
    port: 4173,
    strictPort: false,
    host: true
  }
})
