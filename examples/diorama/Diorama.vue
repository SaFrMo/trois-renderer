<template>
    <TroisCanvas renderer="$attached.renderer" :cameraPosition="[0, 0, 5]">
        <WebGLRenderer
            :args="[{ antialias: true }]"
            attach="renderer"
            :localClippingEnabled="true"
        />
        <OrbitControlsWrapper />
        <DioramaComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DioramaComponent from './components/DioramaComponent.vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'

export default defineComponent({
    components: { DioramaComponent, OrbitControlsWrapper },
})
</script>
