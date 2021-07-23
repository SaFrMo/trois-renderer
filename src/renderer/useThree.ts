import { reactive, toRefs } from "@vue/reactivity"
import { Trois } from './types'
import * as THREE from 'three'
import { isNumber } from 'lodash'
import { processProp } from './objects'

let mouseListener: (event: MouseEvent) => void

export let scene: THREE.Scene = new THREE.Scene()
export let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()

const transformPropsToSceneOptions = (props: Trois.VNodeProps) => {
    return {
        antialias: true,
        background: 'black',
        camera: null,
        cameraPosition: null,
        ...props
    } as Trois.SceneOptions
}

// Build Trois
export const initTrois = (props: Trois.VNodeProps) => {
    if (troisInternals.initialized) return

    troisInternals.initialized = true

    const sceneOptions = transformPropsToSceneOptions(props)

    // build scene
    // TODO: more robust
    scene = troisInternals.scene = new THREE.Scene()
    if (typeof sceneOptions.background === 'string' || isNumber(sceneOptions.background)) {
        troisInternals.scene.background = troisInternals.scene.background ?? new THREE.Color()
            ; (troisInternals.scene.background as THREE.Color).set(sceneOptions.background)
    }
}

export const completeTrois = ({ element }: { element: Trois.Element }) => {
    const sceneOptions = transformPropsToSceneOptions(element.props)

    // use $attached camera or build a new one
    const camera = troisInternals.camera = (processProp({ element, prop: sceneOptions.camera }) ?? new THREE.PerspectiveCamera(45, 0.5625, 1, 1000)) as THREE.Camera
    if (sceneOptions.cameraPosition) {
        const pos = sceneOptions.cameraPosition
        const cameraPos = (Array.isArray(pos) ? pos : [pos.x, pos.y, pos.z]) as [number, number, number]
        troisInternals.camera.position.set.apply(troisInternals.camera.position, cameraPos)
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
    const enterValues: Array<THREE.Intersection> = [],
        sameValues: Array<THREE.Intersection> = [],
        leaveValues: Array<THREE.Intersection> = currentIntersections

    // element arrays
    const entering: Array<{ element: Trois.Element, intersection: THREE.Intersection }> = []
    const staying: Array<{ element: Trois.Element, intersection: THREE.Intersection }> = []
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

    const leaving: Array<{ element: Trois.Element, intersection: THREE.Intersection }> = leaveValues.map(intersection => {
        return {
            element: interactables.find(interactable => interactable.instance?.uuid === intersection.object.uuid) as any as Trois.Element,
            intersection
        }
    })

    // new interactions
    entering.forEach(({ element, intersection }) => {
        fireEventsFromIntersections({ element, eventKeys: ['onPointerEnter'], intersection })
    })

    // unchanged interactions
    staying.forEach(({ element, intersection }) => {
        const eventKeys: Array<Trois.EventKey> = ['onPointerOver', 'onPointerMove']
        fireEventsFromIntersections({ element, eventKeys, intersection })
    })

    // exited interactions
    leaving.forEach(({ element, intersection }) => {
        const eventKeys: Array<Trois.EventKey> = ['onPointerLeave', 'onPointerOut']
        fireEventsFromIntersections({ element, eventKeys, intersection })
    })

    currentIntersections = intersections || []
}

// utility function for firing multiple callbacks and multiple events on a Trois.Element
const fireEventsFromIntersections = ({ element, eventKeys, intersection }: { element: Trois.Element, eventKeys: Array<Trois.EventKey>, intersection: THREE.Intersection }) => {
    eventKeys.forEach(eventKey => {
        if (element.eventListeners[eventKey]) {
            element.eventListeners[eventKey].forEach(cb => {
                cb({ intersection })
            })
        }
    })
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

