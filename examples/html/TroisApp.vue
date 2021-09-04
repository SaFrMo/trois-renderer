<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <mesh @pointerEnter="color = 'tomato'" @pointerLeave="color = 'white'">
            <meshBasicMaterial :color="color" />
        </mesh>
    </TroisCanvas>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref('white')
</script>