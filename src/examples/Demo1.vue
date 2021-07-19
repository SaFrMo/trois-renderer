<template>
    <TroisCanvas background="white" :cameraPosition="[0, -100, 30]">
        <OrbitControlsWrapper :autoRotate="false" />

        <pointLight
            ref="light1"
            color="#0E09DC"
            :intensity="0.85"
            :position="[0, 0, 50]"
        />
        <pointLight
            ref="light2"
            color="#1CD1E1"
            :intensity="0.85"
            :position="[0, 0, 50]"
        />
        <pointLight
            ref="light3"
            color="#18C02C"
            :intensity="0.85"
            :position="[0, 0, 50]"
        />
        <pointLight
            ref="light4"
            color="#ee3bcf"
            :intensity="0.85"
            :position="[0, 0, 50]"
        />

        <RefractionMesh />
        <NoisyPlane />
    </TroisCanvas>
</template>

<script>
import { defineComponent } from 'vue'
import RefractionMesh from './Demo1/RefractionMesh.vue'
import NoisyPlane from './Demo1/NoisyPlane.vue'
import OrbitControlsWrapper from './OrbitControlsWrapper.vue'

export default defineComponent({
    name: 'App',
    components: { NoisyPlane, RefractionMesh, OrbitControlsWrapper },
    mounted() {
        this.update()
    },
    methods: {
        update() {
            requestAnimationFrame(this.update)

            const { light1, light2, light3, light4 } = this.$refs
            const time = Date.now() * 0.001
            const d = 100
            light1.$el.instance.position.x = Math.sin(time * 0.1) * d
            light1.$el.instance.position.y = Math.cos(time * 0.2) * d
            light2.$el.instance.position.x = Math.cos(time * 0.3) * d
            light2.$el.instance.position.y = Math.sin(time * 0.4) * d
            light3.$el.instance.position.x = Math.sin(time * 0.5) * d
            light3.$el.instance.position.y = Math.sin(time * 0.6) * d
            light4.$el.instance.position.x = Math.sin(time * 0.7) * d
            light4.$el.instance.position.y = Math.cos(time * 0.8) * d
        },
    },
})
</script>
