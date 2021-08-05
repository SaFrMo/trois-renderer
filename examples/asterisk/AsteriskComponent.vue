<template>
    <group :scale="10">
        <gltf @gltfAdded="onAdded" src="/asterisk/extrudedDodec.glb" />
    </group>
</template>

<script lang="ts">
// ported from the fantastic https://larsberg.github.io/2018_nov_sketches/1002_gltf/index.html

import { defineComponent } from 'vue'
import { Trois } from '../../src/renderer/types'
import { Color, MeshStandardMaterial, TextureLoader } from 'three'
import { tween } from 'popmotion'

const textureLoader = new TextureLoader()

export default defineComponent({
    methods: {
        async onAdded({ instance }: { instance: Trois.Instance }) {
            const emissiveMap = await textureLoader.loadAsync(
                '/asterisk/snoothGradient_wbw.png'
            )

            const skin = instance.getObjectByProperty(
                'type',
                'SkinnedMesh'
            ) as THREE.SkinnedMesh

            if (!skin) throw 'no skin detected (yuck)'

            skin.castShadow = true
            skin.receiveShadow = true

            // update material
            skin.material = new MeshStandardMaterial({
                // skinning: true, // not needed anymore?
                emissive: new Color('#323238'),
                emissiveMap,
            })

            //
            skin.skeleton.update()
            ;(skin.skeleton as any).originalBones = []
            skin.skeleton.bones.forEach(function (bone, idx) {
                ;(skin.skeleton as any).originalBones[idx] = bone.clone()
            })
        },
    },
})
</script>
