<template>
    <mesh>
        <component :is="$route.params.geometry" />
    </mesh>
</template>