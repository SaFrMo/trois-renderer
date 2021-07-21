import { reactive, toRefs } from "@vue/reactivity"
import { Trois } from './types'
import * as THREE from 'three'
import { isNumber } from 'lodash'

let mouseListener: (event: MouseEvent) => void

export let scene: THREE.Scene = new THREE.Scene()
export let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()

// Build Trois
export const initTrois = (sceneOptions: Trois.SceneOptions) => {
    if (troisInternals.initialized) return

    troisInternals.initialized = true

    // build camera
    // TODO: more robust
    const camera = troisInternals.camera = new THREE.PerspectiveCamera(45, 0.5625, 1, 1000)
    const pos = sceneOptions.cameraPosition
    const cameraPos = (Array.isArray(pos) ? pos : [pos.x, pos.y, pos.z]) as [number, number, number]
    troisInternals.camera.position.set.apply(troisInternals.camera.position, cameraPos)

    // build scene
    // TODO: more robust
    scene = troisInternals.scene = new THREE.Scene()
    if (typeof sceneOptions.background === 'string' || isNumber(sceneOptions.background)) {
        troisInternals.scene.background = troisInternals.scene.background ?? new THREE.Color()
            ; (troisInternals.scene.background as THREE.Color).set(sceneOptions.background)
    }

    // build renderer
    // TODO: more robust, allow renderer overrides
    const useDefaultRenderer = true
    if (useDefaultRenderer) {
        renderer = troisInternals.renderer = new THREE.WebGLRenderer({
            antialias: sceneOptions.antialias
        })
        troisInternals.renderer.setSize(window.innerWidth, window.innerHeight)

        // build mouse listener for the renderer DOM element
        mouseListener = (event: MouseEvent) => {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            troisInternals.mousePos.x = (event.clientX / (troisInternals.renderer?.domElement.width ?? 1)) * 2 - 1;
            troisInternals.mousePos.y = - (event.clientY / (troisInternals.renderer?.domElement.height ?? 1)) * 2 + 1;
        }
    }

    // build update loop
    // TODO: more robust
    const update = () => {
        requestAnimationFrame(update)

        onBeforeRender.forEach(callback => callback({ camera, renderer, scene, }))
        renderer.render(scene, camera)
        onAfterRender.forEach(callback => callback({ camera, renderer, scene, }))
    }
    update()
}

export const getOrCreateMainInteractionRaycaster = () => {
    let raycaster = useTrois().raycaster.value

    // create raycaster if needed
    if (!raycaster) {
        troisInternals.raycaster = raycaster = new THREE.Raycaster()

        // start mouse listener
        troisInternals.renderer?.domElement.addEventListener('mousemove', mouseListener)
        // attach to render loop
        addBeforeRender(mainInteractionRaycasterCallback)
    }

    return raycaster
}

let currentIntersections: Array<THREE.Intersection> = []

const mainInteractionRaycasterCallback: Trois.UpdateCallback = ({ camera }) => {
    troisInternals.raycaster?.setFromCamera(troisInternals.mousePos, camera)
    const intersections = troisInternals.raycaster?.intersectObjects(interactables.map(v => v.instance as any as THREE.Object3D))

    // intersection arrays
    const enterValues: Array<THREE.Intersection> = [], sameValues: Array<THREE.Intersection> = [], leaveValues: Array<THREE.Intersection> = currentIntersections

    // element arrays
    const entering: Array<{ element: Trois.Element, intersection: THREE.Intersection }> = []
    const staying: Array<{ element: Trois.Element, intersection: THREE.Intersection }> = []
    const leaving: Array<{ element: Trois.Element, intersection: THREE.Intersection }> = []
    intersections?.forEach((intersection) => {
        const currentIdx = currentIntersections.findIndex(v => v.object === intersection.object)
        if (currentIdx === -1) {
            // new intersection
            enterValues.push(intersection)

            const found = interactables.find(v => v.instance?.uuid === intersection.object.uuid)
            if (found) {
                entering.push({ element: found, intersection })
            }
        } else {
            // existing intersection
            sameValues.push(intersection)

            const found = interactables.find(v => v.instance?.uuid === intersection.object.uuid)
            if (found) {
                staying.push({ element: found, intersection })
            }
        }
        // this is a current intersection, so it won't be in our `leave` array
        leaveValues.shift()
    })

    // console.log({ entering, staying, leaveValues })

    // fire events
    entering.forEach(({ element, intersection }) => {
        console.log(element)
        if (element.eventListeners['onPointerEnter']) {
            element.eventListeners['onPointerEnter'].forEach(cb => {
                console.log('enter')
                cb({ intersection })
            })
        }
    })

    staying.forEach(({ element, intersection }) => {
        const events: Array<Trois.EventKey> = ['onPointerOver', 'onPointerMove']
        events.forEach(evt => {
            if (element.eventListeners[evt]) {
                element.eventListeners[evt].forEach(cb => {
                    console.log('over')
                    cb({ intersection })
                })
            }
        })
    })

    currentIntersections = intersections || []
    // intersections?.filter(intersection => !currentIntersections.includes(intersection))
    // const oldValues = intersections?.filter
}

export const interactables: Array<Trois.Element> = []

export const addInteractable = (target: Trois.Element) => {
    interactables.push(target)
}

export const removeInteractable = (target: Trois.Element) => {
    const idx = interactables.indexOf(target)
    if (idx !== -1) {
        interactables.splice(idx)
    }
}

// Update callbacks
export const onBeforeRender: Array<Trois.UpdateCallback> = []
export const onAfterRender: Array<Trois.UpdateCallback> = []

export const addBeforeRender = (cb: Trois.UpdateCallback) => {
    onBeforeRender.push(cb)
}
export const addAfterRender = (cb: Trois.UpdateCallback) => {
    onAfterRender.push(cb)
}

// Trois instance
const troisInternals = reactive<Trois.Internals>({
    camera: null,
    initialized: false,
    mousePos: new THREE.Vector2(Infinity, Infinity),
    raycaster: null,
    renderer: null,
    scene: null,
    size: {
        width: 0,
        height: 0,
    },
})

export const useTrois = () => {
    return toRefs(troisInternals)
}

