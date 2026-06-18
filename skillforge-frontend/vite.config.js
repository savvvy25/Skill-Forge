import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // FIX #8 — VERCEL SPA ROUTING: Without `base: '/'` explicit and
  // the rewrite in vercel.json, deep-linked routes like /dashboard
  // return 404 from Vercel's CDN. The vercel.json rewrite handles it,
  // but base must remain '/' (default) for asset paths to resolve correctly.
  base: '/',

  server: {
    port: 5173,
    open: true,
    // FIX #9 — LOCAL PROXY: Avoid CORS issues during local dev by proxying
    // /api/* to the Spring Boot backend. This means the browser always calls
    // localhost:5173/api/... even though the backend is on :8080.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    // FIX #10 — SOURCE MAPS: Disable source maps in production to reduce
    // bundle size and avoid leaking source code.
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
