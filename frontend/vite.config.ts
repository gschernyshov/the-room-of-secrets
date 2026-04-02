import 'dotenv/config'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const paths = (p: string) => path.resolve(__dirname, p)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': paths('src'),
      '@/app': paths('src/app'),
      '@/pages': paths('src/pages'),
      '@/widgets': paths('src/widgets'),
      '@/features': paths('src/features'),
      '@/entities': paths('src/entities'),
      '@/shared': paths('src/shared'),
    },
  },
  server: {
    host: true,
    port: Number(process.env.PORT ?? '8003'),
    strictPort: true,
  },
})
