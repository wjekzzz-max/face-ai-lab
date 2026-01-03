import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/face-ai-lab/',   // ✅ 이 줄 추가
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})


