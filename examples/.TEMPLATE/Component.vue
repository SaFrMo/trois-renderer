<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <OrbitControlsWrapper />
        <mesh />
    </TroisCanvas>
</template>

<script lang="ts" setup>
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
</script>