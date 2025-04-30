import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { MonacoEditorPlugin } from 'vite-plugin-monaco-editor'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    MonacoEditorPlugin(),
  ],
})