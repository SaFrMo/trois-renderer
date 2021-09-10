<template>
    <mesh>
        <component :is="$route.params.geometry" />
        <meshBasicMaterial wireframe />
    </mesh>
</template>