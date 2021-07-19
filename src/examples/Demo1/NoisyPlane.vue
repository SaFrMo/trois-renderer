<template>
    <mesh :scale-x="50" :scale-y="50" :rotation-x="Math.PI * -0.5" :y="-10">
        <planeBufferGeometry />

        <!-- create plane material consisting of:
            - displacement (dispRT.texture) 
            - normal (normRT.texture)
        -->
        <meshBasicMaterial
            displacementMap="$attach.dispMat"
            color="red"
            ref="mat"
        >
            <!-- create FullScreenQuad pass -->

            <!-- create displacement RT -->
            <webGLCubeRenderTarget
                :args="[
                    512,
                    {
                        depthBuffer: false,
                        stencilBuffer: false,
                    },
                ]"
                attach="dispRT"
            />
            <!-- create displacement map ShaderMaterial -->
            <shaderMaterial
                :args="[
                    {
                        uniforms: { uTime, uNoiseCoef },
                        vertexShader: dispVert,
                        fragmentShader: dispFrag,
                    },
                ]"
                attach="dispMat"
            />

            <!-- create normal RT -->
            <!-- create normal map ShaderMaterial -->
        </meshBasicMaterial>
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { vertex as dispVert, fragment as dispFrag } from './shaders/dispMap'

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
        console.log(this.$refs)
    },
})
</script>
