<template>
    <TroisCanvas :cameraPosition="[0, 0, 20]">
        <OrbitControlsWrapper :autoRotate="false" />

        <!-- calendar -->
        <group>
            <!-- TODO: month name -->

            <!-- days -->
            <!-- TODO: separate component for calendar days -->
            <!-- day number and link to experiment, if present -->
            <mesh
                v-for="(pos, i) in positions"
                :key="i"
                :position-x="pos.x"
                :position-y="pos.y"
            />
        </group>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { days, getDayPositions } from './utils'

export default defineComponent({
    components: {
        OrbitControlsWrapper,
    },
    setup() {
        // const now = new Date()
        // const date = reactive({
        //     month: now.getMonth(),
        //     date: now.getDate(),
        //     day: now.getDay(),
        //     dayName: days[now.getDay()],
        // })

        return {
            // date,
            positions: getDayPositions(),
        }
    },
})
</script>