<template>
    <TroisCanvas background="beige" :cameraPosition="[-2, 5, 15]">
        <!-- <OrbitControlsWrapper :autoRotate="false" /> -->

        <!-- camera will always be looking at this -->
        <mesh
            :visible="false"
            ref="cameraLookTarget"
            :position="cameraLookTarget"
        />

        <!-- lighting -->
        <directionalLight :intensity="2" />

        <!-- calendar -->
        <group :position-x="-3.3" :position-y="2.2" v-if="loaded">
            <!-- month name -->
            <mesh v-if="loaded" :position-x="-0.275" :position-y="1.2">
                <textGeometry
                    :args="[month, { font, size: 0.5, height: 0.02 }]"
                />
                <meshBasicMaterial
                    :transparent="true"
                    :color="black"
                    :opacity="0"
                    ref="monthMaterial"
                />
            </mesh>

            <!-- days -->
            <!-- TODO: zoom in on date, fade other dates on click -->
            <DayMesh
                v-for="(position, i) in positions"
                :key="i"
                :position="position"
                :black="black"
                :delay="500 + i * 15"
                @set-target="setCameraTarget"
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
import { FontLoader, Mesh, MeshBasicMaterial, Vector3 } from 'three'
import DayMesh from './components/DayMesh.vue'
import ExerciseComponent from './components/ExerciseComponent.vue'
import { useTrois } from '../../src/renderer/useThree'
const trois = useTrois()
import { tween } from 'popmotion'

let action: any

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
            cameraLookTarget: [0, 0, 0],
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
                if (cam) {
                    cam?.lookAt(
                        (this.$refs.cameraLookTarget as any).instance.position
                    )
                }
            },
            { immediate: true }
        )
    },
    methods: {
        setCameraTarget({
            camPosition,
            lookPosition,
        }: {
            camPosition: Vector3
            lookPosition: Vector3
        }) {
            // get look target
            const cameraLookTarget: Mesh = (this.$refs.cameraLookTarget as any)
                .instance

            const camera = trois.camera.value

            // ignore if no camera
            if (!camera) return

            // stop current movement
            if (action) action.stop()

            // move camera and look target to target positions
            tween({
                from: [
                    camera.position.x,
                    camera.position.y,
                    camera.position.z,
                    cameraLookTarget.position.x,
                    cameraLookTarget.position.y,
                    cameraLookTarget.position.z,
                ],
                to: [
                    camPosition.x,
                    camPosition.y,
                    camPosition.z,
                    lookPosition.x,
                    lookPosition.y,
                    lookPosition.z,
                ],
                duration: 800,
            }).start(
                ([camX, camY, camZ, lookX, lookY, lookZ]: Array<number>) => {
                    camera.position.set(camX, camY, camZ)
                    cameraLookTarget.position.set(lookX, lookY, lookZ)
                    camera.lookAt(cameraLookTarget.position)
                }
            )
        },
    },
    watch: {
        async loaded(newVal) {
            if (newVal) {
                await this.$nextTick()

                const materialInstance = (this.$refs.monthMaterial as any).$el
                    .instance as MeshBasicMaterial
                tween({ duration: 300 }).start((v: number) => {
                    materialInstance.opacity = v
                })
            }
        },
    },
})
</script>