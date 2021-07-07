import { reactive, toRefs } from "@vue/reactivity"
import { TroisInternals } from "./types"
import * as THREE from 'three'
import { isNumber } from 'lodash'

// TODO: type for scene options
export const initTrois = (sceneOptions: any) => {
    // already initialized, ignore
    if (troisInternals) return

    // build camera
    // TODO: more robust
    const camera = new THREE.PerspectiveCamera(45, 0.5625, 1, 1000)
    camera.position.set.apply(camera.position, sceneOptions['camera-position'])

    // build scene
    // TODO: more robust
    const scene = new THREE.Scene()
    if (typeof sceneOptions.background === 'string' || isNumber(sceneOptions.background)) {
        scene.background = scene.background ?? new THREE.Color()
            ; (scene.background as THREE.Color).set(sceneOptions.background)
    }

    // build renderer
    // TODO: more robust
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    // build update loop
    // TODO: more robust
    const update = () => {
        requestAnimationFrame(update)
        if (!renderer) return
        renderer.render(scene, camera)
    }
    update()

    // save result
    troisInternals = reactive<TroisInternals>({
        renderer,
        scene,
        camera,
        size: {
            width: 0,
            height: 0
        }
    })
}

export let troisInternals: TroisInternals

export const useTrois = () => {
    return toRefs(troisInternals)
}