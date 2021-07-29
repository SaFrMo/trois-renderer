<template>
    <group>
        <ClickMesh :position-x="-spread" />
        <ClickMesh :position-x="spread" />
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ClickMesh from './ClickMesh.vue'

export default defineComponent({
    components: { ClickMesh },
    props: {
        spread: { type: Number, default: 2 },
    },
})
</script>
