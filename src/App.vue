<template>
    <TroisCanvas>
        <mesh
            :position="[x, y, -8]"
            :rotation="[0, rotationY, 0]"
            :scale="scale"
        >
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
            rotationY: 0,
            scale: 1,
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

            this.rotationY += 0.02
            this.x = Math.sin(Date.now() * 0.001)
            this.y = Math.cos(Date.now() * 0.001)
            this.scale = Math.sin(Date.now() * 0.001)
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
