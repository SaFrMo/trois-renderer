<template>
    <TroisCanvas :cameraPosition="[0, 0, 5]">
        <OrbitControlsWrapper />

        <spotLight color="white" :intensity="0.5" :position="[0, 150, 0]" />
        <spotLight color="red" :intensity="0.5" :position="[0, -150, 0]" />

        <instancedMesh :args="[null, null, count]" :scale="0.3" ref="mesh">
            <sphereGeometry />
            <meshPhongMaterial />
        </instancedMesh>

        <effectComposer>
            <bloomEffect
                :args="[
                    {
                        luminanceThreshold: 0.1,
                        intensity: 2.0,
                        resolutionScale: 0.3,
                    },
                ]"
            />
            <pixelationEffect :args="[5]" />
        </effectComposer>
    </TroisCanvas>
</template>

 <script lang="ts">
import { defineComponent } from 'vue'
import { Object3D, InstancedMesh, Vector3 } from 'three'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'
import { Trois } from '../renderer/types'

const scratch = new Object3D()

export default defineComponent({
    components: { OrbitControlsWrapper },
    data() {
        return {
            count: 1000,
            objects: [] as Array<any>,
            rotation: [0, 0, 0],
        }
    },
    mounted() {
        const target = (this.$refs.mesh as any).$el.instance as InstancedMesh

        for (let i = 0; i < this.count; i++) {
            const x = Math.random() * 20 - 10
            const y = Math.random() * 20 - 10
            const z = Math.random() * 20 - 10

            const obj = {
                position: [x, y, z],
                rotation: new Vector3(),
                rotationSpeed: {
                    x: Math.random() * 0.1 - 0.05,
                    y: Math.random() * 0.1 - 0.05,
                },
                scale: Math.random() * 0.5,
            }
            this.objects.push(obj)

            scratch.position.set(x, y, z)
            scratch.updateMatrix()
            target.setMatrixAt(i, scratch.matrix)
        }

        target.instanceMatrix.needsUpdate = true

        this.update()
    },
    methods: {
        log({ element }: { element: Trois.Element }) {
            // console.log(element)
        },
        update() {
            requestAnimationFrame(this.update)

            const target = (this.$refs.mesh as any).$el
                .instance as InstancedMesh

            for (let i = 0; i < this.objects.length; i++) {
                const obj = this.objects[i]
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
    // computed: {
    //     orbitArgs() {
    //         const { camera, renderer } = trois
    //         return [camera.value, renderer.value?.domElement].filter(Boolean)
    //     },
    // },
})
</script>
