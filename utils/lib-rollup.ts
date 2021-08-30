import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: 'dist/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'umd',
        name: 'TroisRenderer',
        globals: {
            vue: 'Vue',
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
