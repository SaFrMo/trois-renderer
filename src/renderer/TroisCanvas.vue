<template>
    <div class="container" :style="containerStyle">
        <canvas :style="canvasStyle">
            <slot />
        </canvas>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

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
})
</script>
