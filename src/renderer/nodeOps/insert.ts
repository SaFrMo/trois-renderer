import { Trois } from '../types'
import { isObject3D } from '../trois/lib'
import { createObject, updateAllObjectProps, } from '../trois/objects'
import { setupObserver } from '../components/TroisCanvas'
import { completeTrois, useTrois } from '../trois/useThree'
const trois = useTrois()
export let updateLoop: Trois.UpdateLoop | null = null

const createChildrenRecursively = (host: Trois.Element, parent: THREE.Scene | THREE.Object3D) => {
    // insert host
    if (host.instance) {
        parent.add(host.instance as unknown as THREE.Object3D)

        // call onAdded now that we've been added to the scene
        if (host.props.onAdded) {
            const arr = Array.isArray(host.props.onAdded) ? host.props.onAdded : [host.props.onAdded]
            arr.forEach(func => func({
                element: host,
                instance: host.instance,
                trois,
                scene: trois.scene,
                camera: trois.camera,
                renderer: trois.renderer
            }))
        }
    }

    // figure out who will be the child's parent, the host or the ancestor
    const childParent = host.instance ?? parent
    for (let child of host.childCreationQueue) {
        createChildrenRecursively(child, childParent as any)
    }
}

export const insert = async (
    element: Trois.Element,
    parent: Trois.Element,
    ref?: Trois.Element | null
) => {
    // debug
    // console.log('insert', { name: element.name, element, parent, ref })

    // cancel if no valid name
    if (!element.name) return

    // handle dom elements
    if (element.domElement || element.props.isDom) {
        handleDomElement({ element, parent })
        return
    }

    // build object instance
    element.instance = createObject({ name: element.name, element })

    // if this element is a loader and the `src` attribute is being used,
    // let's assume we want to create the loader and run `load`
    const isUsingLoaderSugar = element.name.toLowerCase().endsWith('loader')
        && element.props.src
        && (element.props.attach || element.props.attachArray)

    // run special loader behavior
    if (isUsingLoaderSugar) {
        const loader = element.instance as any as Trois.GenericThreeLoader
        // ensure parent has attached spaces ready
        parent.attached = parent.attached || {}
        parent.attachedArray = parent.attachedArray || {}


        if (element.name.toLowerCase() === 'textureloader') {
            // if this is a texture loader, immediately pass
            // load function to parent attachment
            const textureLoader = loader as any as THREE.TextureLoader
            const loading = textureLoader.load(element.props.src)

            // TODO: generalize this and following attachArray to function?
            // lots of repeated code otherwise
            if (element.props.attach) {
                parent.attached = {
                    [element.props.attach]: loading,
                    ...parent.attached || {}
                }
            }

            if (element.props.attachArray) {
                if (!parent.attachedArray[element.props.attachArray]) {
                    parent.attachedArray[element.props.attachArray] = []
                }
                parent.attachedArray[element.props.attachArray].push(loading)

            }
        } else {
            // use a standard callback-based loader
            loader.load(element.props.src, loadedData => {
                if (element.props.attach) {
                    parent.attached = {
                        [element.props.attach]: loadedData,
                        ...parent.attached || {}
                    }
                }

                if (element.props.attachArray) {
                    if (!parent.attachedArray[element.props.attachArray]) {
                        parent.attachedArray[element.props.attachArray] = []
                    }
                    parent.attachedArray[element.props.attachArray].push(loadedData)

                }
            }, null, err => { throw new Error(err) })
        }
    }

    // save the instance's uuid to the element
    element.instanceUuid = element.instance.uuid

    // attach to parent if needed
    // (avoid if using loader sugar, since that will happen in the callback)
    if (element.props.attach && !isUsingLoaderSugar) {
        parent.attached = {
            [element.props.attach]: element.instance,
            ...(parent.attached || {})
        }
    }
    // do the same for attached arrays
    if (element.props.attachArray && !isUsingLoaderSugar) {
        if (!parent.attachedArray[element.props.attachArray]) {
            parent.attachedArray[element.props.attachArray] = []
        }
        parent.attachedArray[element.props.attachArray].push(element.instance)
    }

    // save to parent
    parent.children.push(element)
    element.parentNode = parent

    // add any object3Ds to the scene
    if (isObject3D(element?.instance)) {
        let parentElement = parent ?? (element as any).__vueParentComponent?.parent?.vnode?.el
        if (parentElement.props?.hasOwnProperty('data-trois-container') || parentElement.props?.isContainer) {
            // ensure trois is running
            if (!trois.scene.value) throw 'Trois scene not set up'

            // add any children that need to be created
            // TODO: trois.scene.value should work without casting as `any` - why doesn't it work on build?
            createChildrenRecursively(element, trois.scene.value as any)
        } else if (parentElement?.instance) {
            // parent instance already exists, so let's add directly to it
            const parentInstance = parentElement.instance
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

    // fire ready callback
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
    Object.keys(element?.props?.style ?? {}).forEach(key => {
        (element.domElement?.style ?? {} as any)[key] = (element?.props?.style ?? {})[key]
    })

    // if this is the wrapper, let's finish setup
    if (element?.props?.isContainer) {

        if (updateLoop) {
            // stop old update loop
            updateLoop.stop()
        }

        // start new update loop
        updateLoop = completeTrois({ element })
        updateLoop.update()
    }

    // attach container to parent
    if (typeof parent === 'string') {
        const parentEl = document.querySelector(parent) as any as HTMLElement
        parentEl.appendChild(element.domElement as any)
    } else if (parent?.domElement) {
        parent.domElement.appendChild(element.domElement as any)
    }

    if (element.domElement &&
        element.props.isContainer &&
        trois.renderer.value) {
        // if this is the wrapper, let's attach the renderer DOM element
        element.domElement.appendChild(trois.renderer.value.domElement)
        setupObserver(element.domElement)
    } else {
        throw 'Error setting up renderer'
    }
}