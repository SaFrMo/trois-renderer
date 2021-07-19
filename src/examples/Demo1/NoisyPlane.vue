<template>
    <!-- create FullScreenQuad pass -->
    <fullScreenQuad ref="fsQuad" />

    <!-- create displacement map ShaderMaterial -->
    <shaderMaterial
        :args="[
            {
                uniforms: { uTime, uNoiseCoef },
                vertexShader: dispVert,
                fragmentShader: dispFrag,
            },
        ]"
        ref="dispMat"
    />

    <mesh :scale-x="50" :scale-y="50" :rotation-x="Math.PI * -0.5" :y="-10">
        <planeBufferGeometry />

        <!-- create plane material consisting of:
            - displacement (dispRT.texture) 
            - normal (normRT.texture)
        -->
        <meshStandardMaterial
            ref="mat"
            map="$attached.dispRT.texture"
            :displacementScale="5"
            color="green"
        >
            <!-- create displacement RT -->

            <webGLRenderTarget
                :args="[
                    512,
                    512,
                    {
                        depthBuffer: false,
                        stencilBuffer: false,
                    },
                ]"
                ref="dispRT"
                attach="dispRT"
            />

            <!-- create normal RT -->
            <!-- create normal map ShaderMaterial -->
        </meshStandardMaterial>
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { vertex as dispVert, fragment as dispFrag } from './shaders/dispMap'
import { useTrois } from '../../renderer'
import { Trois } from '../../renderer/types'
const trois = useTrois()
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import { ShaderMaterial, WebGLRenderTarget } from 'three'

export default defineComponent({
    data() {
        return {
            uTime: { value: 0 },
            uNoiseCoef: { value: 5 },
            dispVert,
            dispFrag,
        }
    },
    mounted() {
        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            // render displacement
            const renderer = trois.renderer.value
            let {
                fsQuad,
                dispMat,
                dispRT,
            }: {
                fsQuad: any
                dispMat: any
                dispRT: any
            } = this.$refs as any
            fsQuad = fsQuad?.$el?.instance as FullScreenQuad
            dispMat = dispMat?.$el?.instance as ShaderMaterial
            dispRT = dispRT?.$el?.instance as WebGLRenderTarget
            if (!renderer || !fsQuad || !dispMat || !dispRT) return

            fsQuad.material = dispMat
            const oldTarget = renderer.getRenderTarget()
            renderer.setRenderTarget(dispRT)
            fsQuad.render(renderer)
            renderer.setRenderTarget(oldTarget)

            console.log(this.$refs.mat)
        },
    },
})
</script>
