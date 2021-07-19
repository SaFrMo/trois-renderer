<template>
    <mesh :scale-x="50" :scale-y="50" :rotation-x="Math.PI * -0.5" :y="-10">
        <planeBufferGeometry />

        <!-- create plane material consisting of:
            - displacement (dispRT.texture) 
            - normal (normRT.texture)
        -->
        <meshBasicMaterial color="red">
            <!-- create FullScreenQuad pass -->

            <!-- create displacement RT -->
            <!-- create displacement map ShaderMaterial -->

            <!-- create normal RT -->
            <!-- create normal map ShaderMaterial -->
        </meshBasicMaterial>
    </mesh>
</template>