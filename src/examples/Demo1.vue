<template>
    <TroisCanvas background="white" :cameraPosition="[0, 0, 50]">
        <pointLight color="#0E09DC" :intensity="0.85" :position="[0, 0, 50]" />
        <pointLight color="#1CD1E1" :intensity="0.85" :position="[0, 0, 50]" />
        <pointLight color="#18C02C" :intensity="0.85" :position="[0, 0, 50]" />
        <pointLight color="#ee3bcf" :intensity="0.85" :position="[0, 0, 50]" />

        <RefractionMesh />
    </TroisCanvas>
</template>

<script>
import { defineComponent } from 'vue'
import RefractionMesh from './RefractionMesh.vue'

export default defineComponent({
    name: 'App',
    components: { RefractionMesh },
})
</script>
