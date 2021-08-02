<template>
    <group ref="container">
        <!-- shoebox container -->
        <Shoebox />

        <!-- TODO: prevent from rendering outside container -->
        <group name="solar-system">
            <ambientLight :intensity="0.15" />

            <!-- sun -->
            <mesh name="sun" :position-x="sunPos">
                <icosahedronGeometry :args="[0.2, 8]" />
                <meshBasicMaterial :color="sunYellow" />
                <pointLight :color="brightYellow" :intensity="0.8" />
            </mesh>

            <!-- planets -->
            <group
                v-for="(r, i) in radii"
                :key="i"
                :position-x="sunPos"
                :rotation-z="currentRotations[i]"
            >
                <mesh
                    :position-x="
                        ((farthest - nearest) * i) / (radii.length - 1) +
                        nearest
                    "
                >
                    <icosahedronGeometry :args="[r, 4]" />
                    <meshStandardMaterial
                        :color="colors[i]"
                        :metalness="0"
                        :roughness="1"
                        :clippingPlanes="cmpClippingPlanes"
                    />
                </mesh>
            </group>
        </group>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Shoebox from './Shoebox.vue'
import { Plane, PlaneHelper, Vector3 } from 'three'
import { useTrois } from '../../../src/renderer'
const trois = useTrois()

export default defineComponent({
    components: { Shoebox },
    setup() {
        return {
            sunPos: -1,
            nearest: 0.4,
            farthest: 2.2,
            planetCount: 8,
            radii: [0.025, 0.04, 0.04, 0.035, 0.07, 0.08, 0.05, 0.04],
            colors: [
                '#fefefe',
                '#e7bc70',
                '#4d72b4',
                '#9c5f3c',
                '#caa072',
                '#a8836c',
                '#6d9e99',
                '#336099',
            ],
            // planetPositions: [0, 0.2, 0.4, ],
            sunYellow: '#f2ea5c',
            brightYellow: '#fefefe',
            rotations: [0.241, 0.616, 1, 1.88, 11.86, 29.46, 84.01, 164.79],
        }
    },
    data() {
        return {
            currentRotations: [0, 0, 0, 0, 0, 0, 0, 0],
            globalPosition: null as null | Vector3,
            globalScale: null as null | Vector3,
        }
    },
    mounted() {
        this.update()

        const obj = (this.$refs.container as any).$el.instance as THREE.Object3D
        const posHolder = new Vector3()
        obj.getWorldPosition(posHolder)
        this.globalPosition = posHolder

        const scaleHolder = new Vector3()
        obj.getWorldScale(scaleHolder)
        this.globalScale = scaleHolder
    },
    computed: {
        cmpClippingPlanes() {
            let offsetX = 0,
                offsetY = 0
            if (this.globalPosition) {
                offsetX = this.globalPosition.x
                offsetY = this.globalPosition.y

                const obj = (this.$refs.container as any).$el
                    .instance as THREE.Object3D

                const scale = obj.parent?.scale ?? new Vector3(1, 1, 1)

                const output = [
                    // top
                    new Plane(new Vector3(0, -1, 0), offsetY + 0.75 * scale.y),
                    // bottom
                    new Plane(new Vector3(0, 1, 0), -offsetY + 0.75 * scale.y),
                    // left
                    new Plane(new Vector3(1, 0, 0), -offsetX + 1.5 * scale.x),
                ]

                // plane visualizers
                // output.forEach((plane) => {
                //     trois.scene.value?.add(new PlaneHelper(plane, 10, 0x0000ff))
                // })

                return output
            } else {
                return []
            }
        },
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            this.currentRotations = this.currentRotations.map(
                (v, i) => v - (1 / this.rotations[i]) * 0.02
            )
        },
    },
})
</script>
