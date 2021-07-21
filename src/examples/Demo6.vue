<template>
    <TroisCanvas :cameraPosition="[0, 0, 5]">
        <!-- lights -->
        <pointLight
            :color="light1Color"
            :position="[-2, -2, 2]"
            :intensity="0.5"
        />
        <pointLight
            :color="light2Color"
            :position="[-2, 2, 2]"
            :intensity="0.5"
        />
        <pointLight
            :color="light3Color"
            :position="[2, 2, 2]"
            :intensity="0.5"
        />
        <pointLight
            :color="light4Color"
            :position="[2, -2, 2]"
            :intensity="0.5"
        />

        <!-- tubes -->
        <DemoTubes />
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import chroma from 'chroma-js'
import DemoTubes from './Demo6/DemoTubes.vue'

export default defineComponent({
    components: { DemoTubes },
    data() {
        return {
            light1Color: '#b307b5',
            light2Color: '#8132aa',
            light3Color: '#5737d0',
            light4Color: '#0d25bb',
        }
    },
    mounted() {
        window.addEventListener('click', this.randomColors)
    },
    methods: {
        randomColors() {
            this.light1Color = chroma.random().hex()
            this.light2Color = chroma.random().hex()
            this.light3Color = chroma.random().hex()
            this.light4Color = chroma.random().hex()
        },
    },
})
</script>
