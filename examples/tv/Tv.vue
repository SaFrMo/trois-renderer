<template>
    <TroisCanvas
        renderer="$attached.renderer"
        environment="/tv/venice-sunset.hdr"
        :cameraPosition="[0, 0, 10]"
        background="lightblue"
    >
        <OrbitControlsWrapper :autoRotate="false" />

        <!-- renderer fine-tuning -->
        <WebGLRenderer
            attach="renderer"
            :args="[{ antialias: true }]"
            :physicallyCorrectLights="true"
            :outputEncoding="sRGBEncoding"
        />

        <gltf src="/tv/tv1k.glb" :scale="5" :position-y="-1" />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { sRGBEncoding } from 'three'

export default defineComponent({
    components: { OrbitControlsWrapper },
    data() {
        return { sRGBEncoding }
    },
})
</script>
