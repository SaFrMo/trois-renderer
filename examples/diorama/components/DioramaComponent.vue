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
import { Plane, Vector3 } from 'three'

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
        }
    },
    mounted() {
        this.update()
    },
    computed: {
        cmpClippingPlanes() {
            // TODO: offset constant by $refs.container position
            return [
                // top
                new Plane(new Vector3(0, -1, 0), 0.75),
                // bottom
                new Plane(new Vector3(0, 1, 0), 0.75),
                // left
                new Plane(new Vector3(1, 0, 0), 1.5),
            ]
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
