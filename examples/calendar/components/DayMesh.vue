<template>
    <group :position-x="position.x" :position-y="position.y" @click="onClick">
        <!-- background -->
        <mesh
            :scale="[0.8, 0.8, 0.1]"
            @pointer-over="hovering = true"
            @pointer-leave="hovering = false"
            @pointer-down="onClick"
        >
            <meshBasicMaterial color="#FF928B" />
        </mesh>

        <!-- date -->
        <slot name="date" />

        <!-- slot -->
        <group :position-z="demoPositionZ" :scale="demoScale">
            <slot />
        </group>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Vector2, Vector3 } from 'three'
// import { useTrois } from '../../../src/renderer'
// const trois = useTrois()
import { Action, tween } from 'popmotion'
import { TweenInterface } from 'popmotion/lib/animations/tween/types'

let inProgress: TweenInterface

export default defineComponent({
    props: {
        black: String,
        date: Number,
        position: Vector2,
    },
    data() {
        return {
            hovering: false,
            demoPositionZ: 0.3,
            demoScale: 0.2,
        }
    },
    methods: {
        onClick() {
            // const cam = trois.camera.value
            // if (!cam) return
            // const targetPos = new Vector3(
            //     this.position.x,
            //     this.position.y,
            //     0
            // ).clone()
            // tween({
            //     from: [cam.position.x, cam.position.y, cam.position.z],
            //     to: [targetPos.x, targetPos.y, targetPos.z],
            //     duration: 4000,
            // }).start((v: [number, number, number]) => {
            //     cam.position.set(...v)
            //     cam.lookAt(0, 0, 0)
            // })
        },
    },
    watch: {
        hovering(newVal) {
            if (inProgress) {
                inProgress.stop()
            }

            // inProgress =
        },
    },
})
</script>
