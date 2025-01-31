import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://savingtimeoficial.eu-4.evennode.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/uploads': {
        target: 'https://savingtimeoficial.eu-4.evennode.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
