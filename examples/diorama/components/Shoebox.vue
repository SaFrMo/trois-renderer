<template>
    <group>
        <!-- top -->
        <mesh
            :scale="[dimensions.x, epsilon, dimensions.z]"
            :position-y="dimensions.y * 0.5"
        >
            <meshStandardMaterial :color="black" :metalness="0" roughness="1" />
        </mesh>
        <!-- back -->
        <mesh
            :scale="[dimensions.x, dimensions.y, epsilon]"
            :position-z="dimensions.z * -0.5"
        >
            <meshStandardMaterial :color="black" :metalness="0" roughness="1" />
        </mesh>
        <!-- bottom -->
        <mesh
            :scale="[dimensions.x, epsilon, dimensions.z]"
            :position-y="dimensions.y * -0.5"
        >
            <meshStandardMaterial :color="black" :metalness="0" roughness="1" />
        </mesh>
        <!-- right -->
        <mesh
            :scale="[epsilon, dimensions.y, dimensions.z]"
            :position-x="dimensions.x * 0.5"
        >
            <meshStandardMaterial :color="black" :metalness="0" roughness="1" />
        </mesh>
        <!-- left -->
        <mesh
            :scale="[epsilon, dimensions.y, dimensions.z]"
            :position-x="dimensions.x * -0.5"
        >
            <meshStandardMaterial :color="black" :metalness="0" roughness="1" />
        </mesh>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {
            dimensions: {
                x: 3,
                y: 1.5,
                z: 1.25,
            },
            epsilon: 0.01,
            black: '#111111',
        }
    },
})
</script>
