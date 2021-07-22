<template>
    <TroisCanvas camera="$attached.camera">
        <orthographicCamera attach="camera" :position="[0, 1, 0]" />

        <mesh ref="parent" :position-z="-5">
            <meshBasicMaterial :wireframe="true" color="white" />
        </mesh>
    </TroisCanvas>
</template>

