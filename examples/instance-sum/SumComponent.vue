<template>
    <instancedMesh :args="[null, null, count]" :scale="0.3" ref="mesh">
        <boxGeometry />
        <meshStandardMaterial />
    </instancedMesh>
</template>

 <script lang="ts">
import { defineComponent } from 'vue'
import { Object3D, InstancedMesh, Vector3 } from 'three'
import SimplexNoise from 'simplex-noise'

const scratch = new Object3D()
const objects = [] as Array<any>
const simplex = new SimplexNoise()

export default defineComponent({
    props: {
        columns: { type: Number, default: 20 },
        count: { type: Number, default: 2000 },
        floor: { type: Number, default: 0.8 },
    },
    mounted() {
        const target = (this.$refs.mesh as any).$el.instance as InstancedMesh
        const columns = this.columns
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
        }
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
                noise = noise > this.floor ? (noise - this.floor) * 2 : 0

                scratch.position.set(
                    ...(obj.originalPosition as [number, number, number])
                )
                scratch.position[obj.onSide ? 'x' : 'z'] += noise
                scratch.updateMatrix()
                target.setMatrixAt(i, scratch.matrix)
            }

            target.instanceMatrix.needsUpdate = true
        },
    },
})
</script>
