<template>
    <group :position="[0, -20, 20]">
        <mesh :rotation="meshRotation" ref="mesh">
            <torusGeometry :args="[8, 3, 8, 6]" />
            <meshStandardMaterial
                color="white"
                :metalness="1"
                :roughness="0"
                :flatShading="true"
                envMap="$attached.cubeRT.texture"
                :refractionRatio="0.98"
            >
                <webGLCubeRenderTarget
                    :args="[
                        256,
                        {
                            mapping: CubeRefractionMapping,
                            format: RGBFormat,
                            generateMipmaps: true,
                            minFilter: LinearMipmapLinearFilter,
                        },
                    ]"
                    ref="rt"
                    attach="cubeRT"
                />
            </meshStandardMaterial>
        </mesh>

        <cubeCamera
            v-if="active"
            :args="[0.1, 2000, $refs?.rt?.$el?.instance]"
            ref="cameraRef"
        />
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    CubeCamera,
    CubeRefractionMapping,
    RGBFormat,
    LinearMipmapLinearFilter,
    Mesh,
    Vector3,
} from 'three'
import { scene, renderer } from '../../renderer'

export default defineComponent({
    data() {
        return {
            meshRotation: [0, 0, 0],
            CubeRefractionMapping,
            RGBFormat,
            LinearMipmapLinearFilter,
            active: false,
        }
    },
    mounted() {
        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)
            const { mesh: meshRef } = this.$refs
            if (!meshRef || !(meshRef as any)?.instance) return

            // rotate torus
            const mesh = (meshRef as any).instance as Mesh
            mesh.rotation.setFromVector3(
                mesh.rotation.toVector3().add(new Vector3(0.02, 0.01, 0))
            )

            // try rendering
            const { cameraRef, rt } = this.$refs
            if (rt) {
                this.active = true
            }
            if (
                !this.$refs.cameraRef ||
                !cameraRef ||
                !(cameraRef as any).$el.instance ||
                !renderer ||
                !scene
            )
                return
            const camera: CubeCamera = (cameraRef as any).$el.instance

            mesh.visible = false
            camera.update(renderer, scene)
            mesh.visible = true
        },
    },
})
</script>
