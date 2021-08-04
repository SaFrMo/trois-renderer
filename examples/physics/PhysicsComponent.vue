<template>
    <group>
        <!-- lighting -->
        <!-- <ambientLight color="#505050" /> -->
        <spotLight
            :shadow-mapSize-width="1024"
            :shadow-mapSize-height="1024"
            :intensity="0.5"
            :castShadow="true"
            :position-y="3"
        />

        <group :position-y="-1">
            <!-- ball -->
            <mesh :position-y="1" :castShadow="true">
                <sphereGeometry :args="[0.3, 16, 16]" />
                <meshPhongMaterial />
            </mesh>

            <!-- ground -->
            <mesh :rotation-x="Math.PI * -0.5" :receiveShadow="true">
                <planeBufferGeometry :args="[10, 10]" />
                <meshPhongMaterial />
            </mesh>
        </group>
        <CannonWorld> </CannonWorld>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
