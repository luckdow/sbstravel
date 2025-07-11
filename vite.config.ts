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
        },
        // Ensure proper file extensions for module scripts
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    chunkSizeWarningLimit: 1000,
    // Improve module resolution and MIME types
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true,
    // Enable source maps for better debugging
    sourcemap: false,
    // Minify for production
    minify: 'esbuild'
  },
  // Configure server for proper MIME types
  server: {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  },
  // Ensure proper module resolution
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
});
