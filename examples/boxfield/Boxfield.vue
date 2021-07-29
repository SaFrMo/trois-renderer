<template>
    <TroisCanvas :cameraPosition="[0, 0, 6]" :rendererOptions="{ alpha: true }">
        <OrbitControlsWrapper :autoRotate="false" />
        <BoxfieldComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import BoxfieldComponent from './BoxfieldComponent.vue'

export default defineComponent({
    components: { OrbitControlsWrapper, BoxfieldComponent },
})
</script>