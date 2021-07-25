<template>
    <TroisCanvas background="white" :cameraPosition="[0, 1.5, 3]">
        <!-- <OrbitControlsWrapper :autoRotate="false" /> -->

        <!-- <spotLight color="white" :intensity="1" :position="[0, 150, 0]" /> -->
        <!-- <spotLight color="green" :intensity="0.5" :position="[0, -150, 0]" /> -->

        <instancedMesh :args="[null, null, count]" :scale="0.3" ref="mesh">
            <boxGeometry />
            <meshBasicMaterial color="black" />
        </instancedMesh>
    </TroisCanvas>
</template>

 <script lang="ts">
import { defineComponent } from 'vue'
import { Object3D, InstancedMesh, Vector3 } from 'three'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'
import SimplexNoise from 'simplex-noise'

const scratch = new Object3D()
const objects = [] as Array<any>
const simplex = new SimplexNoise()

export default defineComponent({
    components: { OrbitControlsWrapper },
    data() {
        return {
            count: 2000,
            rotation: [0, 0, 0],
        }
    },
    mounted() {
        const target = (this.$refs.mesh as any).$el.instance as InstancedMesh
        const columns = 20
        // const totalRows = Math.floor(this.count / columns)

        for (let i = 0; i < this.count; i++) {
            const x = (i % columns) - columns * 0.5
            const y = Math.floor(i / columns) * 0.5
            const z = -y * 2

            const obj = {
                coords: [x, y],
                position: [x, y, z],
                rotation: new Vector3(),
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
        }

        target.instanceMatrix.needsUpdate = true

        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            const target = (this.$refs.mesh as any).$el
                .instance as InstancedMesh

            const now = Date.now() * -0.005

            for (let i = 0; i < objects.length; i++) {
                const obj = objects[i]
                const { coords } = obj
                scratch.position.set.apply(scratch.position, obj.position)
                scratch.rotation.x = obj.rotation.x =
                    obj.rotation.x + obj.rotationSpeed.x
                scratch.rotation.y = obj.rotation.y =
                    obj.rotation.y + obj.rotationSpeed.y
                scratch.scale.setScalar(
                    (simplex.noise2D(
                        (coords[0] + now) * 0.1,
                        (coords[1] + now) * 0.2
                    ) *
                        0.5 +
                        0.5) *
                        0.5 +
                        0.01
                )
                scratch.updateMatrix()
                target.setMatrixAt(i, scratch.matrix)
            }

            target.instanceMatrix.needsUpdate = true
        },
    },
})
</script>
