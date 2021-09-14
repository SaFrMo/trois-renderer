<template>
    <group :position-x="-5" :position-y="5">
        <group v-for="i in rows" :key="i" :position-y="i * -1.5">
            <mesh v-for="j in cols" :key="j" :position-x="j * 1.5">
                <meshBasicMaterial color="orange" />
            </mesh>
        </group>
    </group>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const orangeVisible = ref(true)
onMounted(() => {
    setInterval(() => (orangeVisible.value = !orangeVisible.value), 600)
})

const rows = 5,
    cols = 5
</script>