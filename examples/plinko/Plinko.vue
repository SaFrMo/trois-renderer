<template>
    <TroisCanvas
        :rendererProperties="{ 'shadowMap.enabled': true }"
        :cameraPosition="[0, 0, 50]"
    >
        <OrbitControlsWrapper :autoRotate="false" />
        <PlinkoComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import PlinkoComponent from './PlinkoComponent.vue'
import { useTrois } from '../../src/renderer'
const trois = useTrois()

export default defineComponent({
    components: { PlinkoComponent, OrbitControlsWrapper },
    mounted() {
        // prep renderer
        watch(
            () => trois.renderer.value,
            (renderer) => {
                if (!renderer) return
                renderer.shadowMap.enabled = true
            },
            { immediate: true }
        )
    },
})
</script>