<template>
    <group>
        <pointLight :position="[-1, 1, 0]" color="#ff00ff" />

        <mesh>
            <icosahedronGeometry :args="[1, 10]" />
            <meshStandardMaterial
                map="$attached.map"
                normalMap="$attached.normal"
                roughnessMap="$attached.roughness"
            >
                <textureLoader src="/loader-test/diffuse.jpg" attach="map" />
                <textureLoader src="/loader-test/normal.jpg" attach="normal" />
                <textureLoader
                    src="/loader-test/roughness.jpg"
                    attach="roughness"
                />
            </meshStandardMaterial>
        </mesh>
    </group>
</template>