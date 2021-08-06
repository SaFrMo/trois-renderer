<template>
    <TroisCanvas
        :cameraPosition="[2, 2, 5]"
        :rendererProperties="{ 'shadowMap.enabled': true }"
    >
        <OrbitControlsWrapper :autoRotate="false" />
        <pointLight :position="[2, 2, 0]" :castShadow="true" />
        <ambientLight :intensity="0.5" />
        <DreamscaperComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import DreamscaperComponent from './DreamscaperComponent.vue'

export default defineComponent({
    components: { DreamscaperComponent, OrbitControlsWrapper },
})
</script>