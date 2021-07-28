<template>
    <TroisCanvas :cameraPosition="[2, 2, 5]">
        <OrbitControlsWrapper :autoRotate="false" />

        <mesh ref="parent">
            <meshBasicMaterial :wireframe="true" />

            <mesh :scale="0.5" ref="child" :visible="childVisible">
                <meshBasicMaterial color="red" :wireframe="true" />
            </mesh>
        </mesh>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Mesh } from 'three'

export default defineComponent({
    data() {
        return {
            childVisible: false,
        }
    },
    mounted() {
        console.log((this.$refs.parent as any).instance)

        this.update()

        setInterval(() => (this.childVisible = !this.childVisible), 800)
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            const newX = Math.sin(Date.now() * 0.001)

            const instance: Mesh = (this.$refs.parent as any).instance
            instance.position.x = newX

            if (!this.$refs.child) return

            const child: Mesh = (this.$refs.child as any).instance
            child.position.x = newX
            child.position.y = Math.cos(Date.now() * 0.001)
        },
    },
})
</script>