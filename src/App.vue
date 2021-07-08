<template>
    <TroisCanvas>
        <pointLight color="#0E09DC" />
        <mesh
            :position-x="x + (i - count * 0.5)"
            :position-z="-8"
            :rotation="[0, rotationY, 0]"
            :scale="(scale * i) / count"
            v-for="i in count"
            :key="i"
        >
            <torusKnotBufferGeometry />
            <meshStandardMaterial :color="color" />
        </mesh>
    </TroisCanvas>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
    data() {
        return {
            colors: ['Red', 'Green', 'Blue'],
            colorIndex: 2,
            x: 0,
            rotationY: 0,
            scale: 1,
            count: 20,
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
            // return this.colors[this.colorIndex % this.colors.length]
        },
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            this.rotationY += 0.02
            // this.y = Math.cos(Date.now() * 0.001)
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
