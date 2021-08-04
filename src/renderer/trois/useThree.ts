import { watch } from '@vue/runtime-core'
import { reactive, toRefs } from "@vue/reactivity"
import { Trois } from '../types'
import { Camera, Color, Intersection, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from 'three'
import { processProp } from './objects'
import { setupEnvMap } from './lib'
import { set } from 'lodash'

let mouseListener: (event: MouseEvent) => void
let mouseDownListener: (event: MouseEvent) => void
let mouseUpListener: (event: MouseEvent) => void

export let scene: Scene
export let renderer: WebGLRenderer
export let camera: Camera

const transformPropsToSceneOptions = (props: Trois.VNodeProps) => {
    return {
        antialias: true,
        background: '',
        camera: null,
        cameraPosition: null,
        cameraProperties: { ...(props.cameraProperties ?? {}) },
        environment: null,
        renderer: null,
        rendererOptions: {
            antialias: true,
            ...(props.rendererOptions ?? {})
        },
        rendererProperties: {
            // toneMapping: THREE.ACESFilmicToneMapping,
            ...(props.rendererProperties ?? {})
        },
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
    scene = troisInternals.scene = new Scene()
    // setup scene according to options
    // background color
    if (sceneOptions !== null) {
        if (sceneOptions.background) {
            troisInternals.scene.background = troisInternals.scene.background ?? new Color()
                ; (troisInternals.scene.background as Color).set(sceneOptions.background)
        }
    }
    // environment map
    if (sceneOptions.environment !== null) {
        setupEnvMap({ src: sceneOptions.environment, scene })
    }
}

export const completeTrois = ({ element }: { element: Trois.Element }) => {
    const sceneOptions = transformPropsToSceneOptions(element.props)

    // use $attached camera or build a new one
    camera = troisInternals.camera = (processProp({ element, prop: sceneOptions.camera }) ?? new PerspectiveCamera(45, 0.5625, 1, 1000)) as Camera
    if (sceneOptions.cameraPosition) {
        const pos = sceneOptions.cameraPosition
        const cameraPos = (Array.isArray(pos) ? pos : [pos.x, pos.y, pos.z]) as [number, number, number]
        troisInternals.camera.position.set.apply(troisInternals.camera.position, cameraPos)
    }
    // set camera properties
    Object.keys(sceneOptions.cameraProperties).forEach(cameraProperty => {
        set(camera, cameraProperty, sceneOptions.rendererProperties[cameraProperty])
    })

    // use $attached renderer or build a new one
    renderer = troisInternals.renderer = (processProp<WebGLRenderer>({ element, prop: sceneOptions.renderer }))
        ?? new WebGLRenderer(sceneOptions.rendererOptions)
    // set renderer properties
    Object.keys(sceneOptions.rendererProperties).forEach(rendererProperty => {
        set(renderer, rendererProperty, sceneOptions.rendererProperties[rendererProperty])
    })
    // size renderer
    troisInternals.renderer.setSize(window.innerWidth, window.innerHeight)

    // prep effect composer if we have one
    // TODO

    // build mouse listener for the renderer DOM element
    mouseListener = (event: MouseEvent) => {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        troisInternals.mousePos.x = (event.clientX / (troisInternals.renderer?.domElement.width ?? 1)) * 2 - 1;
        troisInternals.mousePos.y = - (event.clientY / (troisInternals.renderer?.domElement.height ?? 1)) * 2 + 1;
    }
    mouseDownListener = (event: MouseEvent) => {
        troisInternals.mouseDown = true

    }
    mouseUpListener = (event: MouseEvent) => {
        troisInternals.mouseDown = false
    }

    // build update loop
    // TODO: more robust
    const update = () => {
        requestAnimationFrame(update)
        renderTrois()
    }
    update()
}

/** The main render function for Trois. */
export const renderTrois = () => {
    onBeforeRender.forEach(callback => callback({ camera, renderer, scene, }))
    if (troisInternals.runDefaultRenderFunction) {
        renderer.render(scene, camera)
    }
    onAfterRender.forEach(callback => callback({ camera, renderer, scene, }))
}

export const getOrCreateMainInteractionRaycaster = () => {
    let raycaster = useTrois().raycaster.value

    // create raycaster if needed
    if (!raycaster) {
        troisInternals.raycaster = raycaster = new Raycaster()

        // setup mouse listeners when we have a renderer
        let added = false
        let stop = null as any
        stop = watch(() => troisInternals.renderer, (v) => {
            if (v && v.domElement) {
                if (!added) {
                    added = true
                    v.domElement.addEventListener('mousemove', mouseListener)
                    v.domElement.addEventListener('mousedown', mouseDownListener)
                    v.domElement.addEventListener('mouseup', mouseUpListener)
                }
                if (stop && added) {
                    stop()
                }
            }
        }, { immediate: true })

        // attach to render loop
        addBeforeRender(mainInteractionRaycasterCallback)
    }

    return raycaster
}

export let currentIntersections: Array<{ element: Trois.Element, intersection: Intersection }> = []

const mainInteractionRaycasterCallback: Trois.UpdateCallback = ({ camera }) => {
    troisInternals.raycaster?.setFromCamera(troisInternals.mousePos, camera)
    const intersections = troisInternals.raycaster?.intersectObjects(interactables.map(v => v.instance as any as Object3D))

    let enterValues: Array<Intersection> = [],
        sameValues: Array<Intersection> = [],
        leaveValues: Array<Intersection> = [],
        entering: Array<{ element: Trois.Element, intersection: Intersection }> = [],
        staying: Array<{ element: Trois.Element, intersection: Intersection }> = []

    // intersection arrays
    leaveValues = currentIntersections.map(v => v.intersection)

    // element arrays
    intersections?.forEach((intersection) => {
        const currentIdx = currentIntersections.findIndex(v => v.intersection.object === intersection.object)
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
        const leaveIdx = leaveValues.findIndex(v => v.object.uuid === intersection.object.uuid)
        if (leaveIdx !== -1) {
            leaveValues.splice(leaveIdx, 1)
        }
    })

    const leaving: Array<{ element: Trois.Element, intersection: Intersection }> = leaveValues.map(intersection => {
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

    currentIntersections = ([] as any).concat(entering, staying)
}

// utility function for firing multiple callbacks and multiple events on a Trois.Element
const fireEventsFromIntersections = ({ element, eventKeys, intersection }: { element: Trois.Element, eventKeys: Array<Trois.EventKey>, intersection: Intersection }) => {
    if (!element) return
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
export const removeBeforeRender = (cb: Trois.UpdateCallback) => {
    const idx = onBeforeRender.indexOf(cb)
    if (idx !== -1) {
        onBeforeRender.splice(idx, 1)
    }
}
export const addAfterRender = (cb: Trois.UpdateCallback) => {
    onAfterRender.push(cb)
}

// Trois instance
export const troisInternals = reactive<Trois.Internals>({
    autoAttach: ['geometry', 'material'],
    autoAttachArray: [],
    camera: null,
    initialized: false,
    mouseDown: false,
    mousePos: new Vector2(Infinity, Infinity),
    raycaster: null,
    runDefaultRenderFunction: true,
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

