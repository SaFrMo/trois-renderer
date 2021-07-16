<template>
    <TroisCanvas background="white" :cameraPosition="[0, 0, 10]">
        <group ref="group">
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
import { Trois } from '../renderer/types'

export default defineComponent({
    data() {
        return {
            active: false,
        }
    },
    mounted() {
        setInterval(() => (this.active = !this.active), 1000)
        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            const { instance } = (this.$refs.group as any).$el as Trois.Element
            if (!instance) return
            instance.position.x = Math.sin(Date.now() * 0.001) * 4
        },
    },
})
</script>
