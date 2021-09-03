<template>
    <TroisCanvas
        :cameraPosition="[2, 2, 5]"
        environment="/tv/venice-sunset.hdr"
        :rendererProperties="{
            physicallyCorrectLights: true,
            outputEncoding: sRGBEncoding,
        }"
    >
        <OrbitControlsWrapper :autoRotate="false" />
        <LoaderTestComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import LoaderTestComponent from './LoaderTestComponent.vue'
import { sRGBEncoding } from 'three'

export default defineComponent({
    components: { LoaderTestComponent, OrbitControlsWrapper },
    data() {
        return {
            sRGBEncoding,
        }
    },
})
</script>