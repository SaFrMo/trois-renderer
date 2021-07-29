<template>
    <TroisCanvas background="beige" :cameraPosition="[-2, 5, 15]">
        <OrbitControlsWrapper :autoRotate="false" />

        <!-- lighting -->
        <directionalLight :intensity="2" />

        <!-- calendar -->
        <group :position-x="-3.3" :position-y="2.2" v-if="loaded">
            <!-- month name -->
            <mesh v-if="loaded" :position-x="-0.275" :position-y="1.2">
                <textGeometry
                    :args="[month, { font, size: 0.5, height: 0.02 }]"
                />
                <meshBasicMaterial :color="black" />
            </mesh>

            <!-- days -->
            <!-- TODO: zoom in on date, fade other dates on click -->
            <DayMesh
                v-for="(position, i) in positions"
                :key="i"
                :position="position"
                :black="black"
            >
                <!-- TODO: daily component in slot (<component :is="..."/> ?)-->
                <template v-slot:default>
                    <ExerciseComponent
                        year="2021"
                        :month="
                            (new Date().getMonth() + 1)
                                .toString()
                                .padStart(2, '0')
                        "
                        :date="(i + 1).toString().padStart(2, '0')"
                    />
                </template>

                <!-- date -->
                <template v-slot:date>
                    <mesh v-if="loaded" :position="[-0.35, -0.31, 0.05]">
                        <textGeometry
                            :args="[
                                (i + 1).toString(),
                                { font, size: 0.25, height: 0.02 },
                            ]"
                        />
                        <meshBasicMaterial color="beige" />
                    </mesh>
                </template>
            </DayMesh>
        </group>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { days, getDayPositions, months } from './utils'
import { FontLoader } from 'three'
import DayMesh from './components/DayMesh.vue'
import ExerciseComponent from './components/ExerciseComponent.vue'
import { useTrois } from '../../src/renderer/useThree'
const trois = useTrois()

export default defineComponent({
    components: {
        OrbitControlsWrapper,
        DayMesh,
        ExerciseComponent,
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

        watch(
            () => trois.camera.value,
            (cam) => {
                cam?.lookAt(0, 0, 0)
            },
            { immediate: true }
        )
    },
})
</script>