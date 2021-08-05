<template>
    <TroisCanvas
        :rendererOptions="{ alpha: true, antialias: true }"
        :cameraPosition="[2, 2, 5]"
        :rendererProperties="rendererProperties"
    >
        <OrbitControlsWrapper :autoRotate="false" />
        <pointLight
            :position-y="0.5"
            :castShadow="true"
            :shadow-mapSize-height="1024"
            :shadow-mapSize-width="1024"
        />
        <AsteriskComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import AsteriskComponent from './AsteriskComponent.vue'
import { PCFSoftShadowMap } from 'three'

export default defineComponent({
    components: { AsteriskComponent, OrbitControlsWrapper },
    setup() {
        return {
            rendererProperties: {
                'shadowMap.type': PCFSoftShadowMap,
                'shadowMap.enabled': true,
            },
        }
    },
})
</script>

<style >
#app > div {
    background: radial-gradient(ellipse at center, #dae6f2 0%, #899199 100%);
}
</style>