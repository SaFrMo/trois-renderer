<template>
    <TroisCanvas :cameraPosition="[0, 0, 5]">
        <OrbitControlsWrapper :autoRotate="false" />
        <TextChaseComponent />
        <hemisphereLight :key="colors[0]" :args="[colors[0], colors[1]]" />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import TextChaseComponent from './TextChaseComponent.vue'
import chroma from 'chroma-js'

export default defineComponent({
    components: { TextChaseComponent, OrbitControlsWrapper },
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