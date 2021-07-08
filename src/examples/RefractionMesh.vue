<template>
    <mesh :rotation="meshRotation">
        <torusGeometry :args="[8, 3, 8, 8]" />
        <meshStandardMaterial
            color="white"
            :metalness="1"
            :roughness="0"
            :flatShading="true"
        />
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            meshRotation: [0, 0, 0],
        }
    },
    mounted() {
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
