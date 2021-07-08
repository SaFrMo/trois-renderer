<template>
    <mesh :rotation="meshRotation">
        <torusGeometry :args="[8, 3, 8, 8]" />
        <meshStandardMaterial
            color="white"
            :metalness="1"
            :roughness="0"
            :flatShading="true"
        />

        <cubeCamera
            attach="cubeCamera"
            v-if="$refs.rt"
            :args="[0.1, 2000, $refs.rt.$el.target]"
        />
    </mesh>

    <!-- cube info -->
    <webGLCubeRenderTarget
        :args="[
            256,
            {
                mapping: CubeRefractionMapping,
                format: RGBFormat,
                generateMipmaps: true,
                minFilter: LinearMipmapLinearFilter,
            },
        ]"
        ref="rt"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    CubeRefractionMapping,
    RGBFormat,
    LinearMipmapLinearFilter,
} from 'three'

export default defineComponent({
    data() {
        return {
            meshRotation: [0, 0, 0],
            CubeRefractionMapping,
            RGBFormat,
            LinearMipmapLinearFilter,
        }
    },
    mounted() {
        console.log('zzzzzz', this.$refs)
        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)
            const [x, y, z] = this.meshRotation
            this.meshRotation = [x + 0.02, y + 0.01, z]
        },
    },
})
</script>
