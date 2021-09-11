<template>
    <mesh>
        <component :is="geo" />
    </mesh>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const geo = ref(route.query.geometry ?? 'boxGeometry')
import { onMounted } from 'vue'

onMounted(() => console.log(route, geo))
</script>