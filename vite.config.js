import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    reportCompressedSize: false,
    // Drop console.log and debugger statements in production builds
    // for cleaner output and a small runtime speedup
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Manual chunk splitting for better long-term cache utilisation
        manualChunks: {
          'three-bundle': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-bundle': ['framer-motion', 'gsap', 'lenis'],
          'react-vendor': ['react', 'react-dom'],
          'ui-utils': ['lucide-react', 'clsx', 'tailwind-merge', 'zustand', 'wouter'],
        },
      },
    },
    // esbuild-level drop for production
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
})
