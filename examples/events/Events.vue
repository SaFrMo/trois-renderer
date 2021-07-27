<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <OrbitControlsWrapper />
        <pointLight :position="[0, 50, 50]" />
        <ClickMesh :x="-2" />
        <ClickMesh :x="2" />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import ClickMesh from './Events/ClickMesh.vue'

export default defineComponent({
    components: { ClickMesh, OrbitControlsWrapper },
})
</script>
