<template>
    <group>
        <mesh>
            <icosahedronGeometry :args="[0.5, 5]" />
            <meshStandardMaterial ref="material" map="$attached.load">
                <textureLoader :load="['/text-chase/verbose.jpg']" />
            </meshStandardMaterial>
        </mesh>

        <hemisphereLight :key="colors[0]" :args="[colors[0], colors[1]]" />
    </group>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import chroma from 'chroma-js'

export default defineComponent({
    setup() {
        const colors = ref([] as any)
        const randomizeColors = () =>
            (colors.value = [chroma.random().hex(), chroma.random().hex()])
        randomizeColors()

        return {
            colors,
            randomizeColors,
        }
    },
})
</script>
