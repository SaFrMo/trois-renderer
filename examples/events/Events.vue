<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <OrbitControlsWrapper />
        <pointLight :position="[0, 50, 50]" />
        <EventComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import EventComponent from './Events/EventComponent.vue'

export default defineComponent({
    components: { EventComponent, OrbitControlsWrapper },
})
</script>
