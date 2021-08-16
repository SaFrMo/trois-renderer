<template>
    <TroisCanvas :cameraPosition="[0, 0, 5]">
        <OrbitControlsWrapper :autoRotate="false" />
        <TextChaseComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import TextChaseComponent from './TextChaseComponent.vue'

export default defineComponent({
    components: { TextChaseComponent, OrbitControlsWrapper },
})
</script>