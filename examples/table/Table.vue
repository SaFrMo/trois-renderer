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

        <TableComponent />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { sRGBEncoding } from 'three'
import TableComponent from './TableComponent.vue'

export default defineComponent({
    components: { OrbitControlsWrapper, TableComponent },
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
