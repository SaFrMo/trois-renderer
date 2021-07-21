<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <OrbitControlsWrapper />
        <pointLight :position="[0, 50, 50]" />
        <mesh
            @pointer-enter="hovering = true"
            @pointer-leave="hovering = false"
            :rotation="[0, Math.PI * 0.25, Math.PI * 0.25]"
        >
            <meshStandardMaterial :color="hovering ? 'red' : 'gray'" />
        </mesh>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'

export default defineComponent({
    components: { OrbitControlsWrapper },
    data() {
        return {
            hovering: false,
        }
    },
    // methods: {
    //     click() {
    //         console.log('clicked!!!!')
    //     },
    // },
})
</script>
