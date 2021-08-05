<template>
    <group>
        <!-- lighting -->
        <ambientLight color="#505050" />
        <spotLight
            color="peachpuff"
            :shadow-mapSize-width="2048"
            :shadow-mapSize-height="2048"
            :intensity="0.5"
            :castShadow="true"
            :position-y="5"
        />

        <group :position-y="rows * -0.5 * spacer.y">
            <!-- board background -->
            <mesh
                :position-y="spacer.y * rows * 0.5 + spacer.y * 0.5"
                :position-z="-0.5"
            >
                <planeGeometry
                    :args="[columnsMax * spacer.x, rows * -spacer.y]"
                />
                <meshBasicMaterial color="tomato" />
            </mesh>

            <!-- ball -->
            <mesh v-physics :position-x="-0.5" :position-y="2">
                <sphereGeometry :args="[1, 16, 16]"
            /></mesh>

            <!-- rods -->
            <group v-for="y in rows" :key="y">
                <mesh
                    v-for="x in y % 2 ? columnsMax : columnsMax - 1"
                    :key="x"
                    :position-y="y * spacer.y + rows * 0.5 * spacer.y"
                    :position-x="
                        (y % 2 ? x : x + 0.5) * spacer.x -
                        spacer.x * (columnsMax + 1) * 0.5
                    "
                    :rotation-z="Math.PI * 0.25"
                    v-physics="{ mass: 0 }"
                >
                    <boxBufferGeometry />
                </mesh>
            </group>

            <!-- receptacles -->
        </group>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {
            spacer: { x: 4, y: -2.4 },
            rows: 12,
            columnsMax: 10,
        }
    },
})
</script>
