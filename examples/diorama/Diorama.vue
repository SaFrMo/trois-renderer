<template>
    <TroisCanvas :cameraPosition="[0, 0, 5]">
        <DioramaComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DioramaComponent from './components/DioramaComponent.vue'

export default defineComponent({
    components: { DioramaComponent },
})
</script>
