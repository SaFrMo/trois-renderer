import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), dts()],
    build: {
        lib: {
            entry: './src/renderer/index.ts',
            name: 'trois-renderer-proof-of-concept',
        },
        rollupOptions: {
            external: ['lodash', 'three', 'vue'],
            output: {
                globals: {
                    vue: 'Vue',
                    three: 'THREE',
                    lodash: 'lodash'
                }
            }
        }
    }
})
