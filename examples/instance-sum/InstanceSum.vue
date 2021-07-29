<template>
    <TroisCanvas background="white" :cameraPosition="[-10, 0, 10]">
        <spotLight :intensity="1" :position="[0, 150, 30]" />

        <SumComponent />
    </TroisCanvas>
</template>

 <script lang="ts">
import { defineComponent, watch } from 'vue'
import { useTrois } from '../../src/renderer'
const trois = useTrois()
import SumComponent from './SumComponent.vue'

export default defineComponent({
    components: { SumComponent },
    mounted() {
        watch(
            () => trois.camera.value,
            (val) => {
                if (val) {
                    val.lookAt(0, 4, 0)
                }
            },
            { immediate: true }
        )
    },
})
</script>
