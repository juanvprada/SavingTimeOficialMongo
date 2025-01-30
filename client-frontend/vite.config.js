import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    https: true,
    proxy: {
      '/api': {
        target: 'https://savingtimeoficial.eu-4.evennode.com',
        changeOrigin: true,
        secure: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('X-Forwarded-Proto', 'https');
            proxyReq.setHeader('origin', 'https://savingtimeoficial.eu-4.evennode.com');
          });
        }
      },
      '/uploads': {
        target: 'https://savingtimeoficial.eu-4.evennode.com',
        changeOrigin: true,
        secure: true,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('X-Forwarded-Proto', 'https');
          });
        }
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://savingtimeoficial.eu-4.evennode.com')
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});