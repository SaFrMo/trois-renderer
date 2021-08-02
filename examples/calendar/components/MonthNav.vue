<template>
    <group name="month-nav">
        <!-- left -->
        <mesh
            :scale="0.75"
            @pointer-enter="hovering = true"
            @pointer-leave="hovering = false"
            @pointer-down="$emit('back')"
            :x="left"
            :y="y"
        />

        <!-- right -->
        <mesh
            :scale="0.75"
            @pointer-enter="hovering = true"
            @pointer-leave="hovering = false"
            @pointer-down="$emit('forward')"
            :x="right"
            :y="y"
        />
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        y: { type: Number, default: 0 },
        left: { type: Number, default: 0 },
        right: { type: Number, default: 0 },
    },
    emits: ['back', 'forward'],
    data() {
        return {
            hovering: false,
        }
    },
    watch: {
        hovering(newVal) {
            document.body.classList[newVal ? 'add' : 'remove']('hovering')
        },
    },
})
</script>
