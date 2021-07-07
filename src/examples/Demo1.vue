<template>
    <TroisCanvas background="white" :camera-position="[0, 0, 50]">
        <pointLight color="#0E09DC" :intensity="0.85" :position="[0, 0, 50]" />
        <pointLight color="#1CD1E1" :intensity="0.85" :position="[0, 0, 50]" />
        <pointLight color="#18C02C" :intensity="0.85" :position="[0, 0, 50]" />
        <pointLight color="#ee3bcf" :intensity="0.85" :position="[0, 0, 50]" />

        <mesh :rotation="meshRotation">
            <torusGeometry :args="[8, 3, 8, 8]" />
            <meshStandardMaterial
                color="white"
                :metalness="1"
                :roughness="0"
                :flatShading="true"
            />
        </mesh>

        <!-- 
             <NoisyPlane
        :width="200" :width-segments="100"
        :height="200" :height-segments="100"
        :time-coef="0.0003"
        :noise-coef="5"
        :displacement-scale="15"
        :delta-coef="1 / 200"
        :position="{ x: 0, y: 0, z: 0 }"
      >
        <PhysicalMaterial />
      </NoisyPlane>
          -->

        <!-- 
             <RefractionMesh ref="mesh" :position="{ x: 0, y: -20, z: 20 }" auto-update>
        <TorusGeometry :radius="8" :tube="3" :radial-segments="8" :tubular-segments="6" />
        <StandardMaterial color="#ffffff" :props="{ metalness: 1, roughness: 0, flatShading: true }" />
      </RefractionMesh> 
      -->
    </TroisCanvas>
</template>

<script>
import { defineComponent } from 'vue'
import { components } from '../renderer/components'

export default defineComponent({
    name: 'App',
    components: components,
    data() {
        return {
            meshRotation: [0, 0, 0],
        }
    },
    mounted() {
        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)
            const [x, y, z] = this.meshRotation
            this.meshRotation = [x + 0.02, y + 0.01, z]
        },
    },
})
</script>
