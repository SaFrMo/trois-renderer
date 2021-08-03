<template>
    <TroisCanvas :cameraPosition="[2, 2, 5]">
        <OrbitControlsWrapper :autoRotate="false" />
        <HierarchyComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import HierarchyComponent from './HierarchyComponent.vue'

export default defineComponent({
    components: { HierarchyComponent, OrbitControlsWrapper },
})
</script>