<template>
    <TroisCanvas background="#fbdf74" :cameraPosition="[0, 0, 50]">
        <!-- lights -->
        <ambientLight :intensity="0.2" />
        <pointLight :intensity="0.75" :position="[-15, 40, 50]" />
        <pointLight :intensity="0.05" :position="[-15, 40, -50]" />

        <!-- solid and wireframe toruses -->
        <mesh ref="torus">
            <torusKnotGeometry :args="[10, 1.6, 400, 20, 4, 1]" />
            <meshToonMaterial color="#fbdf74" />
        </mesh>
        <mesh ref="torusWireframe">
            <torusKnotGeometry :args="[10, 1.61, 400, 20, 4, 1]" />
            <meshToonMaterial :wireframe="true" color="#d9bd52" />
        </mesh>

        <!-- pinball -->
        <mesh ref="sphere" :rotation-y="Math.PI * 0.5">
            <icosahedronGeometry :args="[0.7, 5]" />
            <meshStandardMaterial :metalness="0.7" :roughness="0.5" />

            <mesh :visible="false" ref="cameraTarget" :position="[-10, 4, 0]" />
        </mesh>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { Trois } from '../../src/renderer/types'
import { tween } from 'popmotion'
import { useTrois } from '../../src/renderer/useThree'
const trois = useTrois()

export default defineComponent({
    components: { OrbitControlsWrapper },
    mounted() {
        const camera = trois.camera.value
        const target = (this.$refs.cameraTarget as Trois.Element).instance
        const sphere = (this.$refs.sphere as Trois.Element).instance

        if (!camera || !target || !sphere) return

        camera.lookAt(
            sphere.position.clone().add(sphere.up.clone().multiplyScalar(2.5))
        )

        setTimeout(() => {
            tween({
                from: [camera.position.x, camera.position.y, camera.position.z],
                to: [target.position.x, target.position.y, target.position.z],
                duration: 4000,
            }).start((v: [number, number, number]) => {
                camera.position.set(...v)
                camera.lookAt(
                    sphere.position
                        .clone()
                        .add(sphere.up.clone().multiplyScalar(2.5))
                )
            })
        }, 2000)
    },
})
</script>
