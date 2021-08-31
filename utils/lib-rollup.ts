import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
    {
        input: 'js/index.js',
        output: {
            file: 'dist/trois-renderer.js',
            format: 'umd',
            name: 'TroisRenderer',
            globals: {
                vue: 'vue',
                three: 'THREE',
                lodash: 'lodash',
            },
        },
        plugins: [nodeResolve()],
        external: [
            'lodash',
            'three',
            'vue',
        ],
    },
    {
        input: 'js/index.js',
        output: {
            file: 'dist/trois-renderer.module.js',
            format: 'esm',
            globals: {
                vue: 'vue',
                three: 'THREE',
                lodash: 'lodash',
            },
        },
        plugins: [nodeResolve()],
        external: [
            'lodash',
            'three',
            'vue',
        ],
    }

]
