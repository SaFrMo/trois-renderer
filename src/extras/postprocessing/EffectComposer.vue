<template>
    <vanruescEffectComposer
        :args="['$renderer']"
        @ready="ready"
        v-if="renderer"
    >
        <slot />
    </vanruescEffectComposer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Trois } from '../../renderer/types'
import { addAfterRender, useTrois } from '../../renderer/useThree'
const trois = useTrois()

export default defineComponent({
    computed: {
        renderer() {
            return trois.renderer.value
        },
    },
    methods: {
        ready({ element }: { element: Trois.Element }) {
            // add all passes
            console.log(element)

            // render
            addAfterRender((v) => {
                element?.instance?.render()
            })
        },
    },
})
</script>

