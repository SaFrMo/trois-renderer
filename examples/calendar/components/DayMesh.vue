<template>
    <group
        :position-x="position.x"
        :position-y="position.y"
        @click="onClick"
        :scale="0"
    >
        <group :scale="hovering ? 1.3 : 1">
            <!-- background -->
            <mesh
                :scale="[0.8, 0.8, 0.1]"
                @pointer-over="hovering = true"
                @pointer-leave="hovering = false"
                @pointer-down="onClick"
            >
                <meshBasicMaterial color="#FF928B" />

                <!-- camera zoomed-in position -->
                <mesh
                    :visible="false"
                    :scale="0.2"
                    :position-z="30"
                    ref="cameraTargetPosition"
                >
                    <meshStandardMaterial color="red" />
                </mesh>
            </mesh>

            <!-- date -->
            <slot name="date" />

            <!-- slot -->
            <group :position-z="demoPositionZ" :scale="finalDemoScale">
                <slot />
            </group>
        </group>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Intersection, Object3D, Vector2, Vector3 } from 'three'
import { Trois } from '../../../src/renderer/types'
import { useTrois } from '../../../src/renderer'
const trois = useTrois()
import { Action, spring } from 'popmotion'
// import { TweenInterface } from 'popmotion/lib/animations/tween/types'

// let inProgress: TweenInterface

export default defineComponent({
    props: {
        black: String,
        date: Number,
        position: Vector2,
        delay: Number,
    },
    emits: ['setTarget'],
    data() {
        return {
            hovering: false,
            demoPositionZ: 0.3,
            finalDemoScale: 0.2,
            clickPosition: null as Array<number> | null,
        }
    },
    async mounted() {
        await new Promise((res) => setTimeout(res, this.delay))

        const instance: THREE.Object3D = this.$el.instance
        const startY = instance.position.y
        // scale up
        spring({
            from: 0,
            to: 1,
            stiffness: 130,
            damping: 9,
        }).start((v: number) => {
            instance.scale.setScalar(Math.min(1.1, v))
            instance.position.y = startY - (1 - v)
        })
    },
    methods: {
        onClick(evt: any) {
            const cam = trois.camera.value
            if (!cam) return
            const camPosition = (
                (this.$refs.cameraTargetPosition as any).instance as Object3D
            ).getWorldPosition(new Vector3())

            // cam.position.copy(camPosition)
            const lookPosition = camPosition.clone().add(new Vector3(0, 0, -1))
            this.$emit('setTarget', { camPosition, lookPosition })
        },
    },
    watch: {
        hovering(newVal) {
            document.body.classList[newVal ? 'add' : 'remove']('hovering')
        },
    },
})
</script>
