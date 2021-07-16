<template>
    <TroisCanvas background="white" :cameraPosition="[0, 0, 10]">
        <group :x="x">
            <mesh :y="-1">
                <sphereGeometry />
                <meshBasicMaterial color="blue" />
            </mesh>
            <mesh :y="1" v-if="active">
                <sphereGeometry />
                <meshBasicMaterial color="red" />
            </mesh>
        </group>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            active: false,
            x: 0,
        }
    },
    mounted() {
        setInterval(() => (this.active = !this.active), 1000)
        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            this.x = Math.sin(Date.now() * 0.001) * 4
        },
    },
})
</script>
