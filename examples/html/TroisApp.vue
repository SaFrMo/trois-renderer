<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <mesh @pointerEnter="onClick" />
    </TroisCanvas>
</template>

<script lang="ts" setup>
const onClick = () => {
    console.log('click')
}
</script>