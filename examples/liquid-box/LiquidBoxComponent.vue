<template>
    <mesh>
        <shaderMaterial :args="[{ uniforms, vertexShader, fragmentShader }]" />
    </mesh>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { addBeforeRender } from '../../src/renderer'
import vertexShader from './vert.vs?raw'
import fragmentShader from './frag.fs?raw'

export default defineComponent({
    setup() {
        const uniforms = reactive({
            time: { value: 1.0 },
        })

        addBeforeRender(() => {})

        return { uniforms, vertexShader, fragmentShader }
    },
})
</script>
