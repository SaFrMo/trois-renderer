<template>
    <OrbitControls
        ref="controls"
        v-if="orbitArgs.length === 2"
        :args="orbitArgs"
        :autoRotate="true"
        :enableDamping="true"
        :dampingFactor="0.1"
        :autoRotateSpeed="0.4"
        v-bind="options"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTrois } from '../renderer'
const trois = useTrois()

export default defineComponent({
    props: {
        options: {
            type: Object,
            default: () => ({}),
        },
    },
    mounted() {
        this.update()
    },
    computed: {
        orbitArgs() {
            const { camera, renderer } = trois
            return [camera.value, renderer.value?.domElement].filter(Boolean)
        },
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)
            ;(this.$refs.controls as any)?.$el?.instance?.update()
        },
    },
})
</script>
