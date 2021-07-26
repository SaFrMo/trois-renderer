import { Trois } from '../types'
import { isObject3D } from '../lib'
import { createObject, updateAllObjectProps, } from '../objects'
import { completeTrois, useTrois } from '../useThree'
const trois = useTrois()
import { created } from '..'
const { scene } = trois

export const insert = (
    element: Trois.Element,
    parent: Trois.Element,
    ref?: Trois.Element | null
) => {
    // debug
    console.log('insert', { name: element.name, element, parent, ref })

    // cancel if no valid name
    if (!element.name) return

    // handle dom elements
    if (element.domElement) {
        handleDomElement({ element, parent })
        return
    }


    // build object instance
    element.instance = createObject({ name: element.name, element })

    // attach to parent if needed
    if (element.props.attach) {
        parent.attached = {
            [element.props.attach]: element.instance,
            ...(parent.attached || {})
        }
    }

    if (element.props.attachArray) {
        if (!parent.attachedArray[element.props.attachArray]) {
            parent.attachedArray[element.props.attachArray] = []
        }
        parent.attachedArray[element.props.attachArray].push(element.instance)
    }

    // save vue ID
    element.vueId = (element as any)?.__vueParentComponent?.uid
    if (element.vueId === null || element.vueId === undefined) {
        // console.log('here!!')
    } else {
        created[element.vueId] = element
    }

    // add any object3Ds to the scene
    if (isObject3D(element?.instance)) {
        let parentElement = parent ?? (element as any).__vueParentComponent?.parent?.vnode?.el
        if (parentElement.props?.hasOwnProperty('data-trois-container')) {
            // ensure trois is running
            if (!scene.value) throw 'Trois scene not set up'

            // we're a scene-level component, so let's go ahead and add ourselves to the scene
            scene.value.add(element.instance)

            // add any children that need to be created
            if (isObject3D(element.instance)) {
                element.childCreationQueue.forEach(toCreate => {
                    if (toCreate.instance && isObject3D(toCreate.instance)) {
                        element?.instance?.add(toCreate.instance)
                    }
                })
            }
        } else if (parentElement?.instance) {
            // parent instance already exists, so let's add directly to it
            const parentInstance = parentElement?.instance
            if (isObject3D(parentInstance)) {
                parentInstance.add(element.instance)
            }
        } else {
            // parent instance doesn't exist yet, so let's add to the parent's childCreationQueue
            parentElement.childCreationQueue.push(element)
        }
    }

    // update props after attaching to parent so we can handle positioning, etc
    updateAllObjectProps({ element, props: element.props })

    // ready callback
    if (element.props.onReady) {
        const arr = Array.isArray(element.props.onReady) ? element.props.onReady : [element.props.onReady]
        arr.forEach(func => func({
            element,
            instance: element.instance,
            trois,
            scene: trois.scene,
            camera: trois.camera,
            renderer: trois.renderer
        }))
    }
}

const handleDomElement = ({ element, parent }: { element: Trois.Element, parent: Trois.Element | string }) => {
    // apply styling
    Object.keys(element?.props?.style).forEach(key => {
        (element.domElement?.style ?? {} as any)[key] = (element?.props?.style ?? {})[key]
    })

    // if this is the wrapper, let's finish setup
    if (element?.props?.hasOwnProperty('data-trois-container')) {
        completeTrois({ element })
    }

    // attach container to parent
    if (typeof parent === 'string') {
        const parentEl = document.querySelector(parent) as any as HTMLElement
        parentEl.appendChild(element.domElement as any)
    } else if (parent?.domElement) {
        parent.domElement.appendChild(element.domElement as any)
    }

    if (element.domElement &&
        element.props.hasOwnProperty('data-trois-container') &&
        trois.renderer.value) {
        // if this is the wrapper, let's attach the renderer DOM element
        element.domElement.appendChild(trois.renderer.value.domElement)
    } else {
        throw 'Error setting up renderer'
    }
}