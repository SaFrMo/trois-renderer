<template>
    <vanruescEffectComposer
        :args="['$renderer']"
        @ready="ready"
        v-if="renderer"
    >
        <template v-if="!manualConfig">
            <renderPass :args="['$scene', '$camera']" />
            <effectPass
                @ready="log"
                :args="['$camera', '$attachedArray.effect']"
            >
                <slot />
            </effectPass>
        </template>

        <template v-else>
            <slot />
        </template>
    </vanruescEffectComposer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Trois } from '../../renderer/types'
import { addAfterRender, useTrois } from '../../renderer/useThree'
const trois = useTrois()
import { Clock } from 'three'
const clock = new Clock()

export default defineComponent({
    props: {
        manualConfig: { type: Boolean, default: false },
    },
    computed: {
        renderer() {
            return trois.renderer.value
        },
    },
    methods: {
        log(v: any) {
            console.log(v)
        },
        ready({ element }: { element: Trois.Element }) {
            // add all passes
            element.attachedArray.pass.forEach((pass) => {
                element.instance?.addPass(pass)
            })

            // render
            addAfterRender((v) => {
                element?.instance?.render(clock.getDelta())
            })
        },
    },
})
</script>

