<template>
    <group :position-x="position.x" :position-y="position.y">
        <!-- background -->
        <mesh :scale="[0.8, 0.8, 0.1]">
            <meshBasicMaterial color="#FF928B" />
        </mesh>

        <!-- date -->
        <slot name="date" />

        <!-- slot -->
        <group :position-z="0.3" :scale="0.2">
            <slot>
                <mesh :scale="0.5">
                    <icosahedronGeometry :args="[1, 4]" />
                </mesh>
            </slot>
        </group>
    </group>
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
