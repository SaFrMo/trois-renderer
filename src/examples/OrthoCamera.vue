<template>
    <TroisCanvas camera="$attached.camera">
        <orthographicCamera attach="camera" />

        <mesh ref="parent" :position-z="-5">
            <meshBasicMaterial :wireframe="true" color="white" />
        </mesh>
    </TroisCanvas>
</template>

