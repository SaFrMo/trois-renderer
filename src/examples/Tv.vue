<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <OrbitControlsWrapper />
        <pointLight :position="[0, 5, 5]" />
        <ambientLight :intensity="1.5" />

        <gltf src="/tv1k.glb" :scale="5" :position-y="-1" />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'

export default defineComponent({
    components: { OrbitControlsWrapper },
})
</script>
