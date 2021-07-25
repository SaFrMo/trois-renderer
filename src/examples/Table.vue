<template>
    <TroisCanvas
        renderer="$attached.renderer"
        environment="/table/workshop.hdr"
        :cameraPosition="[0, 0, 10]"
        background="lightblue"
    >
        <OrbitControlsWrapper :autoRotate="false" />

        <!-- renderer fine-tuning -->
        <WebGLRenderer
            attach="renderer"
            :args="[{ antialias: true }]"
            :outputEncoding="sRGBEncoding"
        />

        <gltf src="/table/table.glb" :scale="5" :position-y="-2" />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'
import { sRGBEncoding } from 'three'

export default defineComponent({
    components: { OrbitControlsWrapper },
    data() {
        return { sRGBEncoding }
    },
})
</script>
