import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://bufetec-postgres.onrender.com', // Tu URL de backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Reescribe el path si es necesario
      }
    }
  },
  plugins: [react()],
});
