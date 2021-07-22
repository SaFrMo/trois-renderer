<template>
    <TroisCanvas camera="$attached.camera">
        <orthographicCamera
            ref="camera"
            attach="camera"
            :args="[-2, 2]"
            :position="[3, 3, 5]"
        />

        <mesh ref="box">
            <meshBasicMaterial :wireframe="true" />
        </mesh>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    mounted() {
        ;(this.$refs.camera as any).$el.instance.lookAt(0, 0, 0)

        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)
            ;(this.$refs.box as any).instance.rotation.y -= 0.01
        },
    },
})
</script>
