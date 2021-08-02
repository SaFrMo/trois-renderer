<template>
    <group ref="group">
        <mesh v-for="(t, i) in tubes" :key="i">
            <tubeBufferGeometry
                :args="[
                    '$attached.curve',
                    t.tubularSegments,
                    t.radius,
                    t.radialSegments,
                ]"
            >
                <catmullRomCurve3 :args="[t.points]" attach="curve" />
            </tubeBufferGeometry>
            <meshStandardMaterial :roughness="0.4" :metalness="1" />
        </mesh>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    CatmullRomCurve3,
    PerspectiveCamera,
    TubeBufferGeometry,
    Vector2,
    Vector3,
} from 'three'
import SimplexNoise from 'simplex-noise'
import { useTrois } from '../../../src/renderer/trois/useThree'
const trois = useTrois()

let _points: Array<Array<Vector3>> = []
const NX = 40
const NY = 15
const RADIUS = 0.1
const simplex = new SimplexNoise()

export default defineComponent({
    data() {
        return {
            tubes: [] as Array<any>,
            dx: -1,
            dy: -1,
            x0: -1,
            y0: -1,
            size: new Vector2(),
        }
    },
    mounted() {
        const camera = trois.camera.value as PerspectiveCamera
        const vFOV = (camera.fov * Math.PI) / 180
        const h = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z)
        const w = h * camera.aspect
        this.size = new Vector2(w, h)
        this.initTubes()
        this.update()
    },
    methods: {
        initTubes() {
            _points = [] // point copy (not reactive)
            this.tubes.splice(0)
            this.dx = (this.size.x / (NX - 1)) * 4
            this.dy = this.size.y / (NY - 1)
            this.x0 = -this.size.x * 2
            this.y0 = -this.size.y / 2
            for (let j = 0; j < NY; j++) {
                const points = []
                _points[j] = [] as Array<Vector3>
                for (let i = 0; i < NX; i++) {
                    const v = new Vector3(
                        this.x0 + i * this.dx,
                        this.y0 + j * this.dy,
                        0
                    )
                    points.push(v)
                    _points[j].push(v.clone())
                }
                this.tubes.push({
                    key: `tube-${j}`,
                    points,
                    radius: RADIUS,
                    tubularSegments: NX,
                    radialSegments: 8,
                })
            }
        },
        update() {
            requestAnimationFrame(this.update)

            // TODO
            const mousePos = new Vector2()
            const time = Date.now() * 0.0002
            let points, x, y, x1, y1, noisey, noisez
            for (let j = 0; j < NY; j++) {
                points = _points[j]
                for (let i = 0; i < NX; i++) {
                    x = this.x0 + i * this.dx
                    x1 = x * 0.25
                    y = this.y0 + j * this.dy
                    y1 = y * 0.25
                    noisey =
                        simplex.noise2D(
                            x1 - time + mousePos.x * 0.3,
                            y1 - time + mousePos.y * 0.3
                        ) * 0.3
                    noisez = simplex.noise2D(y1 + time, x1 + time) * 0.3
                    points[i].x = x
                    points[i].y = y + noisey
                    points[i].z = noisez
                }
                this.updateTubeGeometryPoints(
                    (this.$refs.group as any).$el.instance.children[j]
                        ?.geometry as TubeBufferGeometry,
                    points
                )
            }
        },
        updateTubeGeometryPoints(tube: TubeBufferGeometry, points: Vector3[]) {
            if (!tube) return
            const curve = new CatmullRomCurve3(points)
            const { radialSegments, radius, tubularSegments, closed } =
                tube.parameters
            const frames = curve.computeFrenetFrames(tubularSegments, closed)
            tube.tangents = frames.tangents
            tube.normals = frames.normals
            tube.binormals = frames.binormals
            tube.parameters.path = curve

            const pAttribute = tube.getAttribute('position')
            const nAttribute = tube.getAttribute('normal')

            const normal = new Vector3()
            const P = new Vector3()

            for (let i = 0; i < tubularSegments; i++) {
                updateSegment(i)
            }
            updateSegment(tubularSegments)

            tube.attributes.position.needsUpdate = true
            tube.attributes.normal.needsUpdate = true

            function updateSegment(i: number) {
                curve.getPointAt(i / tubularSegments, P)
                const N = frames.normals[i]
                const B = frames.binormals[i]
                for (let j = 0; j <= radialSegments; j++) {
                    const v = (j / radialSegments) * Math.PI * 2
                    const sin = Math.sin(v)
                    const cos = -Math.cos(v)
                    normal.x = cos * N.x + sin * B.x
                    normal.y = cos * N.y + sin * B.y
                    normal.z = cos * N.z + sin * B.z
                    normal.normalize()
                    const index = i * (radialSegments + 1) + j
                    nAttribute.setXYZ(index, normal.x, normal.y, normal.z)
                    pAttribute.setXYZ(
                        index,
                        P.x + radius * normal.x,
                        P.y + radius * normal.y,
                        P.z + radius * normal.z
                    )
                }
            }
        },
    },
})
</script>
