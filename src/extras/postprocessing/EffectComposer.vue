<template>
    <vanruescEffectComposer @ready="ready">
        <slot />
    </vanruescEffectComposer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Trois } from '../../renderer/types'

export default defineComponent({
    methods: {
        ready({
            element,
            instance,
        }: {
            element: Trois.Element
            instance: Trois.Instance
        }) {
            console.log('VVVV', element, instance)
            // TODO: take over render function
        },
    },
})
</script>

