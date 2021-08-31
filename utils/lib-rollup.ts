import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const commonConfig = {
    plugins: [nodeResolve()],
    input: 'js/index.js',
    output: {
        globals: {
            vue: 'vue',
            THREE: 'THREE',
            three: 'three',
            lodash: 'lodash',
        },
    },
    external: [
        'lodash',
        'THREE',
        'three',
        'vue',
    ],
}


export default [
    // umd
    {
        ...commonConfig,
        output: {
            ...commonConfig.output,
            file: 'dist/trois-renderer.js',
            format: 'umd',
            name: 'TroisRenderer',
        },
    },
    // minified umd
    {
        ...commonConfig,
        plugins: [
            ...commonConfig.plugins,
            terser(),
        ],
        output: {
            ...commonConfig.output,
            file: 'dist/trois-renderer.min.js',
            format: 'umd',
            name: 'TroisRenderer',
        },
    },
    // esm module
    {
        ...commonConfig,
        output: {
            ...commonConfig.output,
            file: 'dist/trois-renderer.module.js',
            format: 'esm',
        },
    }
]
