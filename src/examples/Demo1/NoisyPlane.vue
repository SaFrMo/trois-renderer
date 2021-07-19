<template>
    <!-- create FullScreenQuad pass -->
    <fullScreenQuad ref="fsQuad" />

    <!-- create displacement map ShaderMaterial -->
    <shaderMaterial
        key="disp-map"
        :args="[
            {
                uniforms: dispUniforms,
                vertexShader: dispVert,
                fragmentShader: dispFrag,
            },
        ]"
        ref="dispMat"
        :uniforms-uTime-value="time"
    />

    <!-- create normal map ShaderMaterial -->
    <shaderMaterial
        key="normal-map"
        :args="[
            {
                uniforms: normUniforms,
                vertexShader: normVert,
                fragmentShader: normFrag,
            },
        ]"
        ref="normMat"
    />

    <mesh ref="mesh" :rotation-x="Math.PI * -0.5" :y="-10">
        <planeBufferGeometry :args="[50, 50, 50, 50]" />

        <!-- create plane material consisting of:
            - displacement (dispRT.texture) 
            - normal (normRT.texture)
        -->
        <meshStandardMaterial
            ref="mat"
            displacementMap="$attached.dispRT.texture"
            :displacementScale="3"
            normalMap="$attached.normRT.texture"
            :normalMapType="ObjectSpaceNormalMap"
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
            <webGLRenderTarget
                :args="[
                    512,
                    512,
                    {
                        depthBuffer: false,
                        stencilBuffer: false,
                    },
                ]"
                ref="normRT"
                attach="normRT"
            />
        </meshStandardMaterial>
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { vertex as dispVert, fragment as dispFrag } from './shaders/dispMap'
import { vertex as normVert, fragment as normFrag } from './shaders/normalMap'
import { useTrois } from '../../renderer'
import { Trois } from '../../renderer/types'
const trois = useTrois()
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import {
    ObjectSpaceNormalMap,
    ShaderMaterial,
    Texture,
    Vector2,
    WebGLRenderTarget,
} from 'three'

export default defineComponent({
    data() {
        return {
            time: 0,
            uNoiseCoef: { value: 5 },
            dispVert,
            dispFrag,
            normVert,
            normFrag,
            normUniforms: {
                delta: { value: new Vector2(1 / 512, 1 / 512) },
                dispMap: { value: new Texture() },
            },
            dispTexture: null,
            ObjectSpaceNormalMap,
        }
    },
    mounted() {
        this.update()
    },
    computed: {
        dispUniforms() {
            return {
                uTime: { value: (this as any).time },
                uNoiseCoef: (this as any).uNoiseCoef,
            }
        },
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            // get renderer
            const renderer = trois.renderer.value

            // get props
            let { fsQuad, dispMat, dispRT, normMat, normRT } = this.$refs as any

            fsQuad = fsQuad?.$el?.instance
            dispMat = dispMat?.$el?.instance
            dispRT = dispRT?.$el?.instance
            normMat = normMat?.$el?.instance
            normRT = normRT?.$el?.instance
            if (
                !renderer ||
                !fsQuad ||
                !dispMat ||
                !dispRT ||
                !normMat ||
                !normRT
            )
                return

            // save original target
            const oldTarget = renderer.getRenderTarget()

            // render displacement
            fsQuad.material = dispMat
            console.log(dispMat.uniforms.uTime.value)
            renderer.setRenderTarget(dispRT)
            fsQuad.render(renderer)
            this.dispTexture = dispRT.texture

            // render normals
            fsQuad.material = normMat
            renderer.setRenderTarget(normRT)
            this.normUniforms = {
                ...this.normUniforms,
                dispMap: { value: dispRT.texture },
            }
            fsQuad.render(renderer)

            // return to original renderer
            renderer.setRenderTarget(oldTarget)

            this.time += 0.016 * 0.5
        },
    },
})
</script>
