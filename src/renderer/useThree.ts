import { reactive, toRefs } from "@vue/reactivity"
import { TroisInternals } from "./types"
import * as THREE from 'three'
import { isNumber } from 'lodash'

// TODO: type for scene options
export const initTrois = (sceneOptions: any) => {
    if (troisInternals.initialized) return

    troisInternals.initialized = true

    // build camera
    // TODO: more robust
    troisInternals.camera = new THREE.PerspectiveCamera(45, 0.5625, 1, 1000)
    troisInternals.camera.position.set.apply(troisInternals.camera.position, sceneOptions['camera-position'])

    // build scene
    // TODO: more robust
    troisInternals.scene = new THREE.Scene()
    if (typeof sceneOptions.background === 'string' || isNumber(sceneOptions.background)) {
        troisInternals.scene.background = troisInternals.scene.background ?? new THREE.Color()
            ; (troisInternals.scene.background as THREE.Color).set(sceneOptions.background)
    }

    // build renderer
    // TODO: more robust
    troisInternals.renderer = new THREE.WebGLRenderer()
    troisInternals.renderer.setSize(window.innerWidth, window.innerHeight)

    // build update loop
    // TODO: more robust
    const update = () => {
        requestAnimationFrame(update)
        const { renderer, scene, camera } = useTrois()
        console.log(renderer, scene, camera)
        renderer.value.render(scene.value, camera.value)
    }
    update()

    // save result
    // troisInternals.renderer = renderer
    //  reactive<TroisInternals>({
    //     renderer,
    //     scene,
    //     camera,
    //     size: {
    //         width: 0,
    //         height: 0
    //     }
    // })
}

export const troisInternals = reactive<TroisInternals>({
    initialized: false,
    renderer: null,
    scene: null,
    camera: null,
    size: {
        width: 0,
        height: 0,
    },
})

export const useTrois = () => {
    return toRefs(troisInternals)
}