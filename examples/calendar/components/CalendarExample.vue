<template>
    <group :x="0.5">
        <mesh
            v-for="(position, i) in positions"
            :key="i"
            :position="position"
            :scale="[0.8, 0.8, 0.1]"
        >
            <mesh :scale="[1.01, 0.2, 1.1]" :position-y="0.45">
                <meshBasicMaterial color="tomato" />
            </mesh>
        </mesh>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {
            positions: [
                [1, 1, 0],
                [-2, 0, 0],
                [-1, 0, 0],
                [0, 0, 0],
                [1, 0, 0],
                [-2, -1, 0],
                [-1, -1, 0],
                [0, -1, 0],
            ],
        }
    },
})
</script>
