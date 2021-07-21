<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <OrbitControlsWrapper />
        <pointLight :position="[0, 50, 50]" />
        <mesh @click="click" :rotation="[0, Math.PI * 0.25, Math.PI * 0.25]">
            <meshStandardMaterial />
        </mesh>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Trois } from '../renderer/types'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'

export default defineComponent({
    components: { OrbitControlsWrapper },
    data() {
        return {
            active: false,
        }
    },
    methods: {
        click() {
            console.log('clicked')
        },
    },
})
</script>
