import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), dts()],
    build: {
        minify: false,
        lib: {
            entry: './src/renderer/index.ts',
            name: 'trois-renderer',
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
