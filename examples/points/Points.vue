<template>
    <TroisCanvas :cameraPosition="[0, 0, 7]" renderer="$attached.renderer">
        <WebGLRenderer
            :args="[{ antialias: true, preserveDrawingBuffer: true }]"
            attach="renderer"
            :autoClearColor="false"
        />
        <points
            :visible="ready"
            ref="points"
            :args="['$attached.geometry', '$attached.material']"
        >
            <bufferGeometry @ready="geoReady" />

            <pointsMaterial
                :args="[
                    {
                        size: 2,
                        vertexColors: true,
                        depthTest: false,
                        sizeAttenuation: false,
                    },
                ]"
            />
        </points>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Trois } from '../../src/renderer/types'
import { Float32BufferAttribute, MathUtils } from 'three'
import chroma from 'chroma-js'
import { useTrois } from '../../src/renderer'
const trois = useTrois()

export default defineComponent({
    data() {
        return {
            ready: false,
            colorPool: [
                chroma.random().rgb(),
                chroma.random().rgb(),
                chroma.random().rgb(),
            ],
        }
    },
    methods: {
        geoReady({ instance }: { instance: Trois.Instance }) {
            const count = 50
            const spread = 5
            const verts: Array<number> = []
            const colors: Array<number> = []
            for (let i = 0; i < count; i++) {
                verts.push(
                    MathUtils.randFloatSpread(spread),
                    MathUtils.randFloatSpread(spread),
                    MathUtils.randFloatSpread(spread)
                )
                const [r, g, b] =
                    this.colorPool[
                        Math.floor(Math.random() * this.colorPool.length)
                    ]
                colors.push(r / 255, g / 255, b / 255)
            }
            instance.setAttribute(
                'position',
                new Float32BufferAttribute(verts, 3)
            )
            instance.setAttribute(
                'color',
                new Float32BufferAttribute(colors, 3)
            )
            this.update()
        },
        update() {
            this.ready = true
            requestAnimationFrame(this.update)
            if (!this.$refs.points)
                return // ;(this.$refs.points as any).$el.instance.rotation.x =
                //     Date.now() * 0.0001
            ;(this.$refs.points as any).$el.instance.rotation.z =
                Date.now() * 0.0002
        },
    },
})
</script>