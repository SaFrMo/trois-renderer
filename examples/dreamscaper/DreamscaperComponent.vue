<template>
    <group>
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
            <torusGeometry
                :args="[radius + i * spacer, ringThickness, 6, 100]"
            />
            <meshStandardMaterial
                :color="`hsl(${(i / rings) * 360},40%,60%)`"
            />
        </mesh>
    </group>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { stagger, tween, chain, delay, easing } from 'popmotion'

let animation: any

// quick recreation of dreamscaper room: https://youtu.be/ijbgDYWCT9c?t=24

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
            rotations: ref(rotations),
        }
    },
    mounted() {
        this.runAnimation()
    },
    beforeUnmount() {
        if (animation) {
            animation.stop()
        }
    },
    methods: {
        runAnimation() {
            const tweens = new Array(this.rings).fill(undefined).map((v, i) => {
                const start = this.rotations[i]
                const duration = 2000
                const ease = easing.cubicBezier(0.3, 0, 0.1, 1)

                return chain(
                    tween({
                        from: start,
                        to: Math.PI * -0.5,
                        duration,
                        ease,
                    }),
                    delay(duration * 1.25),
                    tween({
                        from: Math.PI * -0.5,
                        to: start,
                        duration,
                        ease,
                    })
                )
            })

            animation = stagger(tweens, 100).start({
                update: (values: any[]) => {
                    values.forEach((v, i) => {
                        if (v !== undefined) {
                            this.rotations[i] = v
                        }
                    })
                },
                complete: this.runAnimation,
            })
        },
    },
})
</script>
