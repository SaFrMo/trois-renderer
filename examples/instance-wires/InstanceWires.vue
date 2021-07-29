<template>
    <TroisCanvas background="white" :cameraPosition="[0, 1.4, 3]">
        <!-- <OrbitControlsWrapper :autoRotate="false" /> -->
        <spotLight :intensity="1" :position="[0, 150, 0]" />

        <WiresComponent />
    </TroisCanvas>
</template>

 <script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import WiresComponent from './WiresComponent.vue'

export default defineComponent({
    components: { OrbitControlsWrapper, WiresComponent },
})
</script>
