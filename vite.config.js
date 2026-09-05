import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const { default: tailwindcss } = await import('@tailwindcss/vite')

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
