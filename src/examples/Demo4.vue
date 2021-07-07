<template>
    <TroisCanvas :camera-position="[0, 0, 10]">
        <spotLight color="white" :intensity="0.5" :position="[0, 150, 0]" />
        <spotLight color="red" :intensity="0.5" :position="[0, -150, 0]" />

        <instancedMesh
            :args="[null, null, 500]"
            ref="mesh"
            :rotation="rotation"
        >
            <torusKnotGeometry />
            <meshPhongMaterial />
        </instancedMesh>
    </TroisCanvas>
</template>

 <script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            rotation: [0, 0, 0],
        }
    },
    mounted() {
        this.update()
        console.log(this.$refs.mesh)
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)
            const [x, y, z] = this.rotation
            this.rotation = [x + 0.02, y + 0.01, z]
        },
    },
})
</script>
