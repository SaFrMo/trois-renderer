<template>
    <TroisCanvas
        background="beige"
        renderer="$attached.renderer"
        :cameraPosition="[-2, 5, 15]"
    >
        <WebGLRenderer
            :args="[{ antialias: true }]"
            attach="renderer"
            :localClippingEnabled="true"
        />

        <!-- camera will always be looking at this -->
        <mesh
            :visible="false"
            ref="cameraLookTarget"
            :position="cameraLookTarget"
        />

        <EasterEgg />

        <!-- lighting -->
        <!-- <directionalLight :intensity="2" :layers="2" /> -->

        <!-- calendar -->

        <group :position-x="-3.3" :position-y="2.2" v-if="loaded" :key="month">
            <!-- month name -->
            <mesh
                name="month-name"
                v-if="loaded"
                :position-x="-0.275"
                :position-y="calendarTop"
            >
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

            <!-- month nav buttons -->
            <MonthNav
                :y="calendarTop + 0.2"
                :left="-spacer.x"
                :right="spacer.x * 7"
                @back="changeMonth(-1)"
                @forward="changeMonth(1)"
            />

            <!-- days -->
            <group>
                <DayMesh
                    v-for="(position, i) in positions"
                    :key="i"
                    :position="position"
                    :black="black"
                    :delay="500 + i * 15"
                    @set-target="setCameraTarget"
                >
                    <!-- daily component in slot (<component :is="..."/> ?)-->
                    <template v-slot:default>
                        <ExerciseComponent
                            :year="year"
                            :month="
                                (monthIndex + 1).toString().padStart(2, '0')
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
        </group>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { days, getDayPositions, months } from './utils'
import { FontLoader, Mesh, MeshBasicMaterial, Vector2, Vector3 } from 'three'
import DayMesh from './components/DayMesh.vue'
import EasterEgg from './components/EasterEgg.vue'
import ExerciseComponent from './Days.vue'
import MonthNav from './components/MonthNav.vue'
import { useTrois } from '../../src/renderer/trois/useThree'
const trois = useTrois()
import { tween } from 'popmotion'

let action: any
let originalCameraPosition = new Vector3()
const originalCameraLookTarget = [0, 0, 0]

export default defineComponent({
    components: {
        OrbitControlsWrapper,
        DayMesh,
        EasterEgg,
        ExerciseComponent,
        MonthNav,
    },
    setup() {
        const spacer = new Vector2(1.1, -1.1)

        return {
            // positions: reactive(),
            loaded: ref(false),
            font: reactive({}),
            black: '#1D1F20',
            calendarTop: 1.2,
            spacer,
            months,
        }
    },
    data() {
        return {
            cameraLookTarget: originalCameraLookTarget,
            monthIndex: new Date().getMonth(),
            year: new Date().getFullYear(),
            // month: months[new Date().getMonth()],
        }
    },
    mounted() {
        const loader = new FontLoader()
        loader.load('/calendar/gentilis_regular.typeface.json', (font) => {
            this.loaded = true
            this.font = font
        })

        // prep camera
        watch(
            () => trois.camera.value,
            (cam) => {
                if (cam) {
                    originalCameraPosition = cam.position.clone()

                    cam.lookAt(
                        (this.$refs.cameraLookTarget as any).instance.position
                    )
                    cam.layers.enableAll()
                }
            },
            { immediate: true }
        )

        // prep renderer
        watch(
            () => trois.renderer.value,
            (renderer) => {
                if (!renderer) return
                renderer.shadowMap.enabled = true
            },
            { immediate: true }
        )

        // prep raycaster
        watch(
            () => trois.raycaster.value,
            (raycaster) => {
                if (!raycaster) return
                raycaster.layers.enableAll()
            },
            { immediate: true }
        )

        window.addEventListener('keydown', (evt) => {
            if (evt.key.toLowerCase() === 'escape') {
                this.setCameraTarget({
                    camPosition: originalCameraPosition,
                    lookPosition: new Vector3(...originalCameraLookTarget),
                })
            }
        })
    },
    computed: {
        month() {
            return months[(this as any).monthIndex]
        },
        positions() {
            const t = this as any
            const output = getDayPositions({
                month: t.monthIndex,
                year: t.year,
                spacer: t.spacer,
            })
            // console.log({ month: t.month, year: t.year })
            return output
        },
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
        changeMonth(delta: number) {
            this.monthIndex += delta
            // console.log(this.monthIndex, delta)
            if (this.monthIndex < 0) {
                this.monthIndex = 12 + this.monthIndex
            } else if (this.monthIndex >= 12) {
                this.monthIndex = this.monthIndex % 12
            }
        },
        refreshMonthName() {
            const materialInstance = (this.$refs.monthMaterial as any).$el
                .instance as MeshBasicMaterial
            tween({ duration: 300 }).start((v: number) => {
                materialInstance.opacity = v
            })
        },
    },
    watch: {
        async loaded(newVal) {
            if (newVal) {
                await this.$nextTick()

                this.refreshMonthName()
            }
        },
        async monthIndex() {
            await this.$nextTick()

            this.refreshMonthName()
        },
    },
})
</script>