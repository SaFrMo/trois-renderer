<template>
    <TroisCanvas background="beige" :cameraPosition="[-2, 5, 15]">
        <OrbitControlsWrapper :autoRotate="false" />

        <!-- calendar -->
        <group :position-x="-3.3" :position-y="2.2" v-if="loaded">
            <!-- month name -->
            <mesh :position-x="-0.275" :position-y="1.2">
                <textGeometry
                    :args="[month, { font, size: 0.5, height: 0.02 }]"
                />
                <meshBasicMaterial :color="black" />
            </mesh>

            <!-- days -->
            <!-- TODO: allow slots for a preview of that day's work -->
            <!-- TODO: zoom in on date, fade other dates on click -->
            <DayMesh
                v-for="(position, i) in positions"
                :key="i"
                :position="position"
                :font="font"
                :black="black"
            />
        </group>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { days, getDayPositions, months } from './utils'
import { FontLoader } from 'three'
import DayMesh from './components/DayMesh.vue'

export default defineComponent({
    components: {
        OrbitControlsWrapper,
        DayMesh,
    },
    setup() {
        return {
            positions: reactive(getDayPositions()),
            loaded: ref(false),
            font: reactive({}),
            black: '#1D1F20',
        }
    },
    data() {
        return {
            month: months[new Date().getMonth()],
        }
    },
    mounted() {
        const loader = new FontLoader()
        loader.load('/calendar/gentilis_regular.typeface.json', (font) => {
            this.loaded = true
            this.font = font
        })
    },
})
</script>