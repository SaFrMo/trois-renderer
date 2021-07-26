<template>
    <TroisCanvas
        renderer="$attached.renderer"
        environment="/table/workshop.hdr"
        :cameraPosition="[0, 2, 4]"
        background="white"
    >
        <OrbitControlsWrapper />

        <pointLight :position="[-5, 3, 0]" :intensity="0.8" />
        <pointLight :position="[-5, 3, 5]" :intensity="0.8" />

        <!-- renderer fine-tuning -->
        <WebGLRenderer attach="renderer" :args="[{ antialias: true }]" />

        <group :rotation-y="Math.PI * -0.15" :y="-0.5">
            <!-- table -->
            <!-- <gltf src="/table/table.glb" :scale="5" :position-y="-2.7" /> -->

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
    methods: {
        getPosition(x: number, z: number) {
            return [x * 0.86, 0, z * 0.495]
        },
        setupShadows(v: any) {
            console.log(v)
            const mesh: THREE.Mesh = v.instance
            mesh.traverse((m: any) => {
                if (m.isMesh) {
                    m.castShadow = true
                    m.receiveShadow = true
                }
            })
        },
    },
})
</script>
