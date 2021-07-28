<template>
    <!-- TODO: separate component for calendar days -->
    <!-- day number and link to experiment, if present -->
    <mesh :position-x="position.x" :position-y="position.y" :scale="0.5">
    </mesh>
    <!-- date -->
    <mesh :position="[position.x, position.y, -0.5]" :scale="[1, 1, 0.2]">
        <meshBasicMaterial color="#FF928B" />
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Vector2 } from 'three'

export default defineComponent({
    props: {
        black: String,
        date: Number,
        position: Vector2,
    },
})
</script>
