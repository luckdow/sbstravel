import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          utils: ['date-fns', 'uuid', 'crypto-js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
