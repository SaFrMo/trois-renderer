<template>
    <group>
        <gltf
            :scale="10"
            @gltfAdded="onAdded"
            src="/asterisk/extrudedDodec.glb"
        />
    </group>
</template>

<script lang="ts">
// ported from the fantastic https://larsberg.github.io/2018_nov_sketches/1002_gltf/index.html

import { defineComponent } from 'vue'
import { Trois } from '../../src/renderer/types'
import {
    Bone,
    Color,
    MathUtils,
    MeshStandardMaterial,
    Quaternion,
    SkinnedMesh,
    TextureLoader,
    Vector3,
} from 'three'
import { spring, ColdSubscription } from 'popmotion'
const { randFloat } = MathUtils

let skin: SkinnedMesh
let springAction: ColdSubscription

// to save quaternions
const currentRotation = new Quaternion()
const startingRotation = new Quaternion()
const targetRotation = new Quaternion()

// to save original bone rotations
const originalBones = [] as Array<Bone>

export default defineComponent({
    methods: {
        async onAdded({ instance }: { instance: Trois.Instance }) {
            const emissiveMap = await new TextureLoader().loadAsync(
                '/asterisk/snoothGradient_wbw.png'
            )

            skin = instance.getObjectByProperty(
                'type',
                'SkinnedMesh'
            ) as SkinnedMesh

            if (!skin) throw 'no skin detected (yuck)'

            skin.castShadow = true
            skin.receiveShadow = true

            // update material
            skin.material = new MeshStandardMaterial({
                emissive: new Color('#323238'),
                emissiveMap,
                color: 'darkseagreen',
            })

            // save original bone positions
            // skin.skeleton.update()
            skin.skeleton.bones.forEach((bone, idx) => {
                originalBones[idx] = bone.clone()
            })

            this.nextSpring()
        },
        nextSpring() {
            const newAxis = new Vector3(
                randFloat(-1, 1),
                randFloat(-1, 1),
                randFloat(-1, 1)
            ).normalize()

            // save starting quaternion
            startingRotation.copy(currentRotation)

            // get new axis
            currentRotation.setFromAxisAngle(newAxis, 0)
            targetRotation.setFromAxisAngle(newAxis, randFloat(-0.5, 0.5))

            // start animation
            springAction = spring({
                from: 0,
                to: 1,
                stiffness: 150,
            }).start({
                update: (t: number) => {
                    currentRotation.copy(startingRotation)
                    currentRotation.slerp(targetRotation, t)

                    skin.skeleton.bones.forEach(function (bone, t) {
                        bone.quaternion.copy(originalBones[t].quaternion)
                        bone.applyQuaternion(currentRotation)
                    })
                },
                complete: () => {
                    if (!this) return
                    this.nextSpring()
                },
            })
        },
    },
    beforeUnmount() {
        if (springAction) {
            springAction.stop()
        }
    },
})
</script>
