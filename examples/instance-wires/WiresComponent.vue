<template>
    <!-- <spotLight color="green" :intensity="0.5" :position="[0, -150, 0]" /> -->

    <instancedMesh :args="[null, null, count]" :scale="0.3" ref="mesh">
        <boxGeometry />
        <meshBasicMaterial color="black" />
    </instancedMesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Color, Object3D, InstancedMesh, Vector3 } from 'three'
import SimplexNoise from 'simplex-noise'
import { keyframes } from 'popmotion'

const scratch = new Object3D()
const objects = [] as Array<any>
const simplex = new SimplexNoise()
const scratchColor = new Color('#ae3b4a')

export default defineComponent({
    props: {
        count: { type: Number, default: 2000 },
        columns: { type: Number, default: 20 },
    },
    data() {
        return {
            rotation: [0, 0, 0],
            color: '#ffffff',
            colors: null as any,
        }
    },
    mounted() {
        this.colors = keyframes({
            values: [
                '#ae3b4a',
                '#9e809a',
                '#2895d6',
                '#efdd7c',
                '#a0e0ff',
                '#e1eaf1',
            ],
        }).start((v: any) => (this.color = v))
        this.colors.stop()

        const target = (this.$refs.mesh as any).$el.instance as InstancedMesh
        const columns = this.columns
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
            target.setColorAt(i, scratchColor)
        }
        if (target.instanceColor) {
            target.instanceColor.needsUpdate = true
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
                const noise =
                    simplex.noise2D(
                        (coords[0] + now) * 0.1,
                        (coords[1] + now) * 0.2
                    ) *
                        0.5 +
                    0.5
                const scale = noise * 0.5 + 0.01

                scratch.position.set.apply(scratch.position, obj.position)
                scratch.rotation.x = obj.rotation.x =
                    obj.rotation.x + obj.rotationSpeed.x
                scratch.rotation.y = obj.rotation.y =
                    obj.rotation.y + obj.rotationSpeed.y
                scratch.scale.setScalar(scale)
                scratch.updateMatrix()
                target.setMatrixAt(i, scratch.matrix)
                ;(this.colors as any).seek(noise)
                scratchColor.set(this.color)
                target.setColorAt(i, scratchColor)
            }

            target.instanceMatrix.needsUpdate = true
            if (target.instanceColor) {
                target.instanceColor.needsUpdate = true
            }
        },
    },
})
</script>
