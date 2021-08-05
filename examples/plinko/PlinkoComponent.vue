<template>
    <group>
        <!-- lighting -->
        <ambientLight color="#505050" />
        <spotLight
            color="peachpuff"
            :shadow-mapSize-width="2048"
            :shadow-mapSize-height="2048"
            :intensity="0.5"
            :castShadow="true"
            :position-y="5"
        />

        <group>
            <mesh
                v-physics
                :rotation-x="Math.PI * 0.2"
                :rotation-z="Math.PI * 0.2"
                key="test"
            >
                <meshBasicMaterial color="blue" />
            </mesh>
            <!-- board background -->
            <mesh v-physics="{ mass: 0 }" :position-y="-3" key="here"> </mesh>
            <!-- rods -->
            <!-- receptacles -->
        </group>
    </group>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { addBeforeRender, removeBeforeRender } from '../../src/renderer'
import * as CANNON from 'cannon-es'

let world: CANNON.World
let sphereBody: CANNON.Body

export default defineComponent({})
</script>
