<template>
    <TroisCanvas :cameraPosition="[2, 2, 5]">
        <OrbitControlsWrapper :autoRotate="false" />
        <router-view />
    </TroisCanvas>
</template>

<script lang="ts" setup>
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
</script>