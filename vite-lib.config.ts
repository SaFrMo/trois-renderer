import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), dts()],
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
