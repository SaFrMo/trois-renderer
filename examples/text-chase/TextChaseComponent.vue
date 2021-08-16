<template>
    <group>
        <mesh :rotation-y="rotation">
            <icosahedronGeometry :args="[1, 5]" />
            <meshStandardMaterial ref="material" map="$attached.load">
                <textureLoader :load="['/text-chase/verbose.jpg']" />
            </meshStandardMaterial>
        </mesh>
    </group>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const rotation = ref(0)
        const update = () => {
            requestAnimationFrame(update)
            rotation.value -= 0.01
        }
        update()

        return {
            rotation,
        }
    },
})
</script>
