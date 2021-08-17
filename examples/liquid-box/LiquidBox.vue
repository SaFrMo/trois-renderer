<template>
    <TroisCanvas :cameraPosition="[2, 2, 5]">
        <OrbitControlsWrapper :autoRotate="false" />
        <LiquidBoxComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import LiquidBoxComponent from './LiquidBoxComponent.vue'

export default defineComponent({
    components: { LiquidBoxComponent, OrbitControlsWrapper },
})
</script>