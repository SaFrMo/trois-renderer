<template>
    <div class="container" data-trois-container :style="containerStyle">
        <canvas :style="canvasStyle">
            <slot />
        </canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PerspectiveCamera } from 'three'
import { useTrois } from './useThree'
const trois = useTrois()

export default defineComponent({
    setup() {
        return {
            containerStyle: {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
            },
            canvasStyle: {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
            },
        }
    },
    mounted() {
        // resize listener
        const resizeObserver = new ResizeObserver(([container]) => {
            this.updateSize(container.contentRect)
        })
        resizeObserver.observe(this.$el.canvas.parentNode)
        this.updateSize({
            width: this.$el.canvas.parentNode.offsetWidth,
            height: this.$el.canvas.parentNode.offsetHeight,
        })
    },
    methods: {
        updateSize({ width, height }: { width: number; height: number }) {
            const { camera, renderer } = trois

            if (!renderer.value) return

            const perspectiveCamera = camera.value as PerspectiveCamera

            perspectiveCamera.aspect = width / height
            perspectiveCamera.updateProjectionMatrix()
            renderer.value.setSize(width, height)

            trois.size.value = { width, height }
        },
    },
})
</script>
