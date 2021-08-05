<template>
    <TroisCanvas
        :rendererProperties="{ 'shadowMap.enabled': true }"
        :cameraPosition="[0, 0, 20]"
    >
        <pointLight :z="10" :y="-2" />

        <OrbitControlsWrapper :autoRotate="false" />
        <SvgComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import SvgComponent from './SvgComponent.vue'

export default defineComponent({
    components: { SvgComponent, OrbitControlsWrapper },
})
</script>