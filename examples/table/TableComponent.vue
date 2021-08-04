<template>
    <group :rotation-y="Math.PI * -0.15" :y="-0.5">
        <!-- table -->
        <!-- <gltf src="/table/table.glb" :scale="5" :position-y="-2.7" /> -->
        <pointLight :intensity="2" :y="5" />

        <!-- scene -->
        <gltf src="/table/building_cabin.glb" :rotation-y="Math.PI * 0.5" />
        <gltf
            src="/table/building_market.glb"
            :rotation-y="Math.PI * 0.5"
            :position="getPosition(2, 0)"
        />
        <gltf
            src="/table/building_house.glb"
            :rotation-y="Math.PI * 0.5"
            :position="getPosition(1, 1)"
        />
        <gltf
            src="/table/grass_forest.glb"
            :rotation-y="Math.PI * 0.5"
            :position="getPosition(1, -1)"
        />
        <gltf
            src="/table/grass_forest.glb"
            :rotation-y="Math.PI * 0.5"
            :position="getPosition(0, -2)"
        />
        <gltf
            src="/table/grass_forest.glb"
            :rotation-y="Math.PI * 0.5"
            :position="getPosition(0, 2)"
        />
        <gltf
            src="/table/building_market.glb"
            :rotation-y="Math.PI * 0.5"
            :position="getPosition(-2, 0)"
        />
        <gltf
            src="/table/building_market.glb"
            :rotation-y="Math.PI * 0.5"
            :position="getPosition(-1, 1)"
        />
        <gltf
            src="/table/grass_forest.glb"
            :rotation-y="Math.PI * 0.5"
            :position="getPosition(-1, -1)"
        />
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    methods: {
        getPosition(x: number, z: number) {
            return [x * 0.86, 0, z * 0.495]
        },
    },
})
</script>
