import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: './src/renderer/index.ts',
            name: 'TroisRenderer',
        },
        rollupOptions: {
            external: ['lodash', 'three', 'vue'],
        }
    }
})
