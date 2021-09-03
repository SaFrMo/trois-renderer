<template>
    <mesh ref="parent">
        <meshBasicMaterial :wireframe="true" />

        <mesh :scale="0.5" ref="child" :visible="childVisible">
            <meshBasicMaterial transparent color="red" wireframe />
        </mesh>
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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

            if (!this.$refs.parent || !this.$refs.child) return

            const instance: THREE.Mesh = (this.$refs.parent as any).instance
            instance.position.x = newX

            if (!this.$refs.child) return

            const child: THREE.Mesh = (this.$refs.child as any).instance
            child.position.x = newX
            child.position.y = Math.cos(Date.now() * 0.001)
        },
    },
})
</script>
