<template>
    <!-- create FullScreenQuad pass -->
    <fullScreenQuad ref="fsQuad" />

    <!-- create displacement map ShaderMaterial -->
    <shaderMaterial
        key="disp-map"
        :args="[
            {
                uniforms: { uTime: { value: 0 }, uNoiseCoef },
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
                uniforms: { dispMap: { value: null }, delta },
                vertexShader: normVert,
                fragmentShader: normFrag,
            },
        ]"
        ref="normMat"
    />

    <mesh ref="mesh" :y="-10">
        <planeBufferGeometry :args="[200, 200, 100, 100]" />

        <!-- create plane material consisting of:
            - displacement (dispRT.texture) 
            - normal (normRT.texture)
        -->
        <meshStandardMaterial
            ref="mat"
            displacementMap="$attached.dispRT.texture"
            :displacementScale="15"
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
const trois = useTrois()
import { ObjectSpaceNormalMap, Texture, Vector2 } from 'three'

export default defineComponent({
    data() {
        return {
            time: 0,
            uNoiseCoef: { value: 5 },
            dispVert,
            dispFrag,
            normVert,
            normFrag,
            delta: { value: new Vector2(1 / 512, 1 / 512) },
            dispTexture: new Texture(),
            ObjectSpaceNormalMap,
        }
    },
    mounted() {
        this.update()
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
            renderer.setRenderTarget(dispRT)
            fsQuad.render(renderer)

            // render normals
            fsQuad.material = normMat
            normMat.uniforms.dispMap.value = dispRT.texture
            renderer.setRenderTarget(normRT)
            fsQuad.render(renderer)

            // return to original target
            renderer.setRenderTarget(oldTarget)

            // update time (.0003 == original demo coefficient, 16 === ms per frame in 60fps)
            this.time += 16 * 0.0003
        },
    },
})
</script>
