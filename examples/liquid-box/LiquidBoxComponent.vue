<template>
    <mesh :scale="2" :rotation-x="rotationX" :rotation-y="rotationY">
        <boxGeometry :args="[1, 1, 1, 100, 100, 100]" />
        <shaderMaterial :args="[{ uniforms, vertexShader, fragmentShader }]" />
    </mesh>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { addBeforeRender } from '../../src/renderer'
import vertexShader from './vert.vs?raw'
import fragmentShader from './frag.fs?raw'

export default defineComponent({
    setup() {
        const uniforms = reactive({
            time: { value: 1.0 },
        })

        const start = Date.now()

        const rotationX = ref(0)
        const rotationY = ref(0)

        addBeforeRender(() => {
            rotationX.value += 0.01
            rotationY.value += 0.008
            uniforms.time.value = (Date.now() - start) * 0.001
        })

        return { uniforms, vertexShader, fragmentShader, rotationX, rotationY }
    },
})
</script>
