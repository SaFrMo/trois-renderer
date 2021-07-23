import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        demo1: './demo1/index.html',
        demo4: './demo4/index.html',
        demo6: './demo6/index.html',
        events: './events/index.html',
        hierarchy: './hierarchy/index.html'
      }
    }
  }
})
