<template>
    <TroisCanvas background="white" :cameraPosition="[-10, 0, 10]">
        <spotLight :castShadow="true" :intensity="1" :position="[0, 150, 30]" />
        <!-- <spotLight color="green" :intensity="0.5" :position="[0, -150, 0]" /> -->

        <instancedMesh
            :castShadow="true"
            :receiveShadow="true"
            :args="[null, null, count]"
            :scale="0.3"
            ref="mesh"
        >
            <boxGeometry />
            <meshStandardMaterial />
        </instancedMesh>
    </TroisCanvas>
</template>

 <script lang="ts">
import { defineComponent, watch } from 'vue'
import { Color, Object3D, InstancedMesh, Vector3 } from 'three'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'
import SimplexNoise from 'simplex-noise'
import { useTrois } from '../renderer'
const trois = useTrois()

const scratch = new Object3D()
const objects = [] as Array<any>
const simplex = new SimplexNoise()
const scratchColor = new Color('#ae3b4a')

export default defineComponent({
    components: { OrbitControlsWrapper },
    data() {
        return {
            count: 2000,
            rotation: [0, 0, 0],
        }
    },
    mounted() {
        watch(
            () => trois.camera.value,
            (val) => {
                if (val) {
                    val.lookAt(0, 4, 0)
                }
            },
            { immediate: true }
        )

        const target = (this.$refs.mesh as any).$el.instance as InstancedMesh
        const columns = 20
        const totalRows = Math.floor(this.count / columns)

        for (let i = 0; i < this.count; i++) {
            const column = (i % columns) - columns * 0.5
            const row = Math.floor(i / columns) * 0.5
            const half = this.count * 0.5

            const x = i < half ? -columns * 0.5 : column
            const y = i < half ? row : row - totalRows * 0.25
            const z = i < half ? column : columns * 0.5

            const obj = {
                coords: [x, y],
                originalPosition: [x, y, z],
                position: [x, y, z],
                rotation: new Vector3(),
                onSide: i < half,
                rotationSpeed: {
                    x: Math.random() * 0.1 - 0.05,
                    y: Math.random() * 0.1 - 0.05,
                },
                scale: 0.5,
            }
            objects.push(obj)

            scratch.position.set(x, y, z)
            scratch.updateMatrix()
            target.setMatrixAt(i, scratch.matrix)
            // target.setColorAt(i, scratchColor)
        }
        // if (target.instanceColor) {
        //     target.instanceColor.needsUpdate = true
        // }
        target.instanceMatrix.needsUpdate = true

        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            const target = (this.$refs.mesh as any).$el
                .instance as InstancedMesh
            if (!target) return

            const now = Date.now() * -0.005

            for (let i = 0; i < objects.length; i++) {
                const obj = objects[i]
                const { coords } = obj
                let noise =
                    simplex.noise2D(
                        (coords[0] + now) * 0.1,
                        (coords[1] + now) * 0.2
                    ) *
                        0.5 +
                    0.5
                noise = noise > 0.8 ? (noise - 0.8) * 2 : 0
                // const scale = noise * 0.5 + 0.01

                scratch.position.set(
                    ...(obj.originalPosition as [number, number, number])
                )
                scratch.position[obj.onSide ? 'x' : 'z'] += noise
                // scratch.rotation.x = obj.rotation.x =
                //     obj.rotation.x + obj.rotationSpeed.x
                // scratch.rotation.y = obj.rotation.y =
                //     obj.rotation.y + obj.rotationSpeed.y
                // scratch.scale.setScalar(scale)
                scratch.updateMatrix()
                target.setMatrixAt(i, scratch.matrix)
                // scratchColor.set(this.color)
                // target.setColorAt(i, scratchColor)
            }

            target.instanceMatrix.needsUpdate = true
            // if (target.instanceColor) {
            //     target.instanceColor.needsUpdate = true
            // }
        },
    },
})
</script>
