<template>
    <TroisCanvas background="beige" :cameraPosition="[0, 0, 20]">
        <OrbitControlsWrapper :autoRotate="false" />

        <!-- calendar -->
        <group :position-x="-3.3" :position-y="2.2">
            <!-- TODO: month name -->
            <mesh v-if="loaded" :position-x="-0.275" :position-y="1.2">
                <textGeometry
                    :args="[month, { font, size: 0.5, height: 0.02 }]"
                />
                <meshBasicMaterial color="#1D1F20" />
            </mesh>

            <!-- days -->
            <!-- TODO: separate component for calendar days -->
            <!-- day number and link to experiment, if present -->
            <mesh
                v-for="(pos, i) in positions"
                :key="i"
                :position-x="pos.x"
                :position-y="pos.y"
                :scale="0.5"
            >
                <meshBasicMaterial color="white" />
            </mesh>
        </group>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { days, getDayPositions, months } from './utils'
import { FontLoader } from 'three'

export default defineComponent({
    components: {
        OrbitControlsWrapper,
    },
    setup() {
        return {
            positions: reactive(getDayPositions()),
            loaded: ref(false),
            font: reactive({}),
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