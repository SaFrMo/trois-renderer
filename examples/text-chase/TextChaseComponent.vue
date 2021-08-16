<template>
    <group>
        <mesh>
            <torusKnotGeometry :args="[1, 0.2, 300, 20]" />
            <meshStandardMaterial />
        </mesh>

        <hemisphereLight :key="colors[0]" :args="[colors[0], colors[1]]" />
    </group>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import chroma from 'chroma-js'

export default defineComponent({
    setup() {
        const colors = ref(['#60917e', '#4e64b4'])
        const randomizeColors = () =>
            (colors.value = [chroma.random().hex(), chroma.random().hex()])

        return {
            colors,
            randomizeColors,
        }
    },
})
</script>
