<template>
    <TroisCanvas
        :rendererProperties="{ 'shadowMap.enabled': true }"
        :cameraPosition="[0, 0, 5]"
    >
        <OrbitControlsWrapper :autoRotate="false" />
        <PhysicsComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import PhysicsComponent from './PhysicsComponent.vue'
import { useTrois } from '../../src/renderer'
const trois = useTrois()

export default defineComponent({
    components: { PhysicsComponent, OrbitControlsWrapper },
    mounted() {
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