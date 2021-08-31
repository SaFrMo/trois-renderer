import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const universals = {
    input: 'js/index.js',
    output: {
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

export default [
    // esm (module)
    {
        ...universals,
        output: [
            {
                ...universals.output,
                format: 'esm',
                file: 'dist/trois.module.js'
            },
        ],
    },
    // umd
    {
        ...universals,
        output: {
            ...universals.output,
            format: 'umd',
            name: 'TroisRenderer',
            file: 'dist/trois.js',
        },
    },
    // min
    {
        ...universals,
        plugins: [
            ...universals.plugins,
            terser(),
        ],
        output: {
            ...universals.output,
            format: 'umd',
            name: 'TroisRenderer',
            file: 'dist/trois.min.js',
        },
    },
]
