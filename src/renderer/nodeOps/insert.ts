import { Trois } from '../types'
import { isObject3D } from '../lib'
import { createObject, updateAllObjectProps, } from '../objects'
import { Object3D } from 'three'
import { useTrois } from '../useThree'
const trois = useTrois()
import { created } from '..'

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


    // ensure trois is running
    const { renderer, scene } = trois
    if (!renderer.value || !scene.value) throw 'Trois renderer or scene not set up'

    // build object instance
    element.instance = createObject({ name: element.name, element })

    // attach to parent if needed
    if (element.props.attach) {
        parent.attached = {
            [element.props.attach]: element.instance,
            ...(parent.attached || {})
        }
    }

    // save vue ID
    element.vueId = (element as any)?.__vueParentComponent?.uid
    if (element.vueId === null || element.vueId === undefined) {
        return
    }
    created[element.vueId] = element

    // add any object3Ds to the scene
    if (element && element.instance && isObject3D(element.instance)) {
        let parentNode = (element as any).__vueParentComponent?.vnode?.el
            ?? parent
        if (!Object.keys(parentNode).length) {
            parentNode = created[(element as any).__vueParentComponent?.parent?.uid ?? -1]
        }
        const parentInstance = parentNode?.instance
        element.parentNode = parentNode

        if (parent.type === 'canvas') {
            // we're a scene-level component, so let's go ahead and add ourselves to the scene
            scene.value.add(element.instance)

            // we'll also need to add any children who have added themselves to our creation queue
            element.children?.filter(Boolean).forEach(c => {
                if (element.instance && c.instance) {
                    element.instance.add(c.instance)
                    updateAllObjectProps({ element: c, props: c.props })
                }
            })

            // reset children array
            // child.children = []
        } else if (parentInstance) {
            // if we're a child of an existing TroisInstance, add ourselves to that instance
            parentInstance.add(element.instance)
        } else if (parentNode) {
            // if we're a child of a nonexistant TroisInstance, tell the node we'll need to
            // be created when that instance is created
            parentNode.children.push(element)

            // TODO: add children to __vueParentComponent.parent.vnode.el.instance
        }
    }

    // update props after attaching to parent so we can handle positioning, etc
    updateAllObjectProps({ element, props: element.props || {} })
}

const handleDomElement = ({ element, parent }: { element: Trois.Element, parent: Trois.Element | string }) => {
    // apply styling
    Object.keys(element?.props?.style).forEach(key => {
        (element.domElement?.style ?? {} as any)[key] = (element?.props?.style ?? {})[key]
    })

    // attach container to parent
    if (typeof parent === 'string') {
        const parentEl = document.querySelector(parent) as any as HTMLElement
        parentEl.appendChild(element.domElement as any)
    } else if (parent?.domElement) {
        parent.domElement.appendChild(element.domElement as any)
    }
}