<template>
    <group>
        <group ref="logo">
            <mesh
                :x="-10"
                :y="2.5"
                v-for="(path, i) in paths"
                :key="i"
                :scale="[0.04, -0.04, 1]"
            >
                <extrudeGeometry
                    :args="[
                        shapes[i],
                        {
                            steps: 4,
                            depth: 1,
                            bevelEnabled: false,
                        },
                    ]"
                />
                <meshStandardMaterial
                    :color="path.color"
                    :args="[{ side: DoubleSide, depthWrite: false }]"
                    :metalness="0.1"
                    :roughness="0.4"
                />
            </mesh>
        </group>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SVGLoader, SVGResultPaths } from 'three/examples/jsm/loaders/SVGLoader'
import { DoubleSide } from 'three'
import { addBeforeRender, removeBeforeRender } from '../../src/renderer'

const loader = new SVGLoader()

export default defineComponent({
    data() {
        return {
            paths: [] as SVGResultPaths[],
            shapes: [] as any[],
            DoubleSide,
        }
    },
    async mounted() {
        const data = await loader.loadAsync('/svg/pixi.svg')
        this.paths = data.paths
        this.shapes = data.paths.map((path) => SVGLoader.createShapes(path))

        addBeforeRender(this.update)
    },
    methods: {
        update() {
            ;(this.$refs.logo as any).$el.instance.rotation.y =
                Math.sin(Date.now() * 0.001) * 0.5
        },
    },
    beforeUnmount() {
        removeBeforeRender(this.update)
    },
})
</script>
