<template>
    <TroisCanvas background="white" :cameraPosition="[0, 1.5, 3]">
        <!-- <OrbitControlsWrapper :autoRotate="false" /> -->

        <spotLight color="white" :intensity="1" :position="[0, 150, 0]" />
        <spotLight color="green" :intensity="0.5" :position="[0, -150, 0]" />

        <instancedMesh :args="[null, null, count]" :scale="0.3" ref="mesh">
            <boxGeometry />
            <meshPhongMaterial />
        </instancedMesh>
    </TroisCanvas>
</template>

 <script lang="ts">
import { defineComponent } from 'vue'
import { Object3D, InstancedMesh, Vector3 } from 'three'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'

const scratch = new Object3D()
const objects = [] as Array<any>

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

            for (let i = 0; i < objects.length; i++) {
                const obj = objects[i]
                scratch.position.set.apply(scratch.position, obj.position)
                scratch.rotation.x = obj.rotation.x =
                    obj.rotation.x + obj.rotationSpeed.x
                scratch.rotation.y = obj.rotation.y =
                    obj.rotation.y + obj.rotationSpeed.y
                scratch.scale.setScalar(obj.scale)
                scratch.updateMatrix()
                target.setMatrixAt(i, scratch.matrix)
            }

            target.instanceMatrix.needsUpdate = true
        },
    },
})
</script>
