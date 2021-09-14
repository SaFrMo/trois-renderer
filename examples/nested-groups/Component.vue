<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <template v-if="condition">
            <mesh />
            <mesh :position-x="2" />
        </template>
    </TroisCanvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const condition = ref(false)
onMounted(() => setInterval(() => (condition.value = !condition.value), 500))
</script>