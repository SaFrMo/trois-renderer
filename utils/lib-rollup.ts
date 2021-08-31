import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const universals = {
    input: 'src/renderer/index.ts',
    output: {
        globals: {
            vue: 'Vue',
            three: 'THREE',
            lodash: 'lodash',
        },
    },
    plugins: [nodeResolve(), typescript({
        tsconfig: 'utils/tsconfig.lib.json',
    })],
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
