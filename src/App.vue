<template>
    <TroisCanvas>
        <mesh :x="x" :y="y" :rotation="rotation">
            <sphereBufferGeometry />
            <meshBasicMaterial :color="color" />
        </mesh>
    </TroisCanvas>
</template>

<script>
import { defineComponent } from 'vue'
import { components } from './renderer/components'

export default defineComponent({
    name: 'App',
    components: components,
    data() {
        return {
            colors: ['Red', 'Green', 'Blue'],
            colorIndex: 0,
            x: 0,
            rotation: { x: 0, y: 0, z: 0 },
        }
    },
    mounted() {
        setInterval(() => {
            this.colorIndex++
        }, 1000)

        this.update()
    },
    computed: {
        color() {
            return this.colors[this.colorIndex % this.colors.length]
        },
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            // this.rotation = { ...this.rotation, y: this.rotation.y + 0.04 }
            this.x = Math.sin(Date.now() * 0.001)
            this.y = Math.cos(Date.now() * 0.001)
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
