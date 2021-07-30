<template>
    <!-- easter egg -->
    <mesh
        :position-y="5"
        :position-z="-10"
        @pointer-enter="easterEggHintVisible = true"
        @pointer-leave="easterEggHintVisible = false"
        @pointer-down="onClick"
        :scale="0.5"
    >
        <icosahedronGeometry :args="[1, 4]" />
        <meshBasicMaterial
            :transparent="true"
            :opacity="opacity"
            color="tomato"
        />
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { tween } from 'popmotion'

let action: any

export default defineComponent({
    data() {
        return {
            easterEggHintVisible: false,
            opacity: 0,
        }
    },
    methods: {
        onClick() {
            console.log('TODO')
        },
    },
    watch: {
        easterEggHintVisible(newVal) {
            if (action) action.stop()

            tween({
                from: this.opacity,
                to: newVal ? 1 : 0,
                duration: 300,
            }).start((v: number) => (this.opacity = v))
            document.body.classList[newVal ? 'add' : 'remove']('hovering')
        },
    },
})
</script>
