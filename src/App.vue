<template>
    <TroisCanvas>
        <mesh>
            <sphereBufferGeometry />
            <meshBasicMaterial :color="color" />
        </mesh>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { components } from './renderer/components'

export default defineComponent({
    name: 'App',
    components: components as any,
    data() {
        return {
            colors: ['Red', 'Green', 'Blue'],
            colorIndex: 0,
        }
    },
    mounted() {
        setInterval(() => {
            this.colorIndex++
        }, 1000)
    },
    computed: {
        color() {
            return this.colors[this.colorIndex % this.colors.length]
        },
    },
})
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
