<template>
    <!-- center ring -->
    <mesh :castShadow="true" :receiveShadow="true">
        <cylinderBufferGeometry :args="[radius, radius, 0.1, 32]" />
        <meshStandardMaterial />
    </mesh>

    <!-- outside rings -->
    <mesh
        :castShadow="true"
        :receiveShadow="true"
        v-for="i in rings"
        :key="i"
        :rotation-x="rotations[i - 1]"
    >
        <torusGeometry :args="[radius + i * spacer, ringThickness, 6, 100]" />
        <meshStandardMaterial />
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        const rings = 20
        const rotations = new Array(rings).fill(undefined).map((v, i) => {
            return i * Math.PI * 0.055 + Math.PI * 0.5
        })
        return {
            rings,
            ringThickness: 0.05,
            radius: 0.5,
            spacer: 0.1,
            rotations,
        }
    },
})
</script>
