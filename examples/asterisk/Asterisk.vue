<template>
    <TroisCanvas
        :rendererOptions="{ alpha: true, antialias: true }"
        :cameraPosition="[2, 2, 5]"
    >
        <OrbitControlsWrapper :autoRotate="false" />
        <AsteriskComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import AsteriskComponent from './AsteriskComponent.vue'

export default defineComponent({
    components: { AsteriskComponent, OrbitControlsWrapper },
})
</script>

<style >
#app > div {
    background: radial-gradient(ellipse at center, #dae6f2 0%, #899199 100%);
}
</style>