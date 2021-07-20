import { Object3D } from 'three'
import { createRenderer, Component } from 'vue'
import { RendererOptions } from '@vue/runtime-core'
import { createObject, updateAllObjectProps, updateObjectProp } from './objects'
import { isObject3D, pascalCase } from './lib'
import { components } from './components'
import { initTrois, useTrois } from './useThree'
import { Trois } from './types'
const trois = useTrois()
const created: { [key: number]: Trois.Element } = {}
import { createElement } from './trois'

/*
    Elements are `create`d from the outside in, then `insert`ed from the inside out.
*/

const nodeOps: RendererOptions<Trois.Node, Trois.Element> = {
    createElement: (type, isSvg, isCustomizedBuiltin, vnodeProps) => {
        const node = createElement(type, vnodeProps)

        // debug
        console.log('createElement', { node, type, isSvg, isCustomizedBuiltin, vnodeProps })

        // container node - this should be the first thing created
        if (node.props?.hasOwnProperty('data-trois-container')) {
            node.props.isDom = true

            // build trois props from wrapper
            const sceneOptions = {
                cameraPosition: [0, 0, 0] as [number, number, number],
                background: 'black',
                ...vnodeProps
            }

            // this is the root container, so let's start trois
            initTrois(sceneOptions)
        }

        if (node.props?.hasOwnProperty('data-trois-canvas')) {
            node.props.isDom = true
        }

        // auto-attach geometries and materials
        if (node.name.endsWith('Geometry')) {
            node.props = { attach: 'geometry', ...node.props }
        }
        if (node.name.endsWith('Material')) {
            node.props = { attach: 'material', ...node.props }
        }

        if (!trois.renderer.value) {
            throw 'Renderer not initialized.'
        }

        if (node.props?.isDom) {
            // canvas has already been created by initTrois,
            // so let's attach it here
            if (type === 'canvas') {
                node.domElement = trois.renderer.value.domElement
            } else {
                node.domElement = document.createElement(type)
            }
        }

        // create trois element
        return node
    },

    insert: (child, parent, ref?: Trois.Element | null) => {
        // debug
        console.log('insert', { child, parent, ref })

        // calculate the ref index because the child's removal may have affected it
        // parent.children = parent.children || []
        const refIndex = (ref ? parent?.children?.indexOf(ref) : -1) ?? -1
        if (refIndex === -1) {
            // child not present in scene yet (v-if, for example)
            // parent.children?.push(child)
            // child.parentNode = parent
        } else {
            parent.children?.splice(refIndex, 0, child)
            child.parentNode = parent
        }

        // convert type to PascalCase
        let name = ''
        if (child.type) {
            name = pascalCase(child.type)
        }

        // cancel if no valid name
        if (!name) return

        // mount dom elements
        if (child.domElement) {
            // apply styling
            Object.keys(child?.props?.style).forEach(key => {
                (child.domElement?.style ?? {} as any)[key] = (child?.props?.style ?? {})[key]
            })

            // attach container to parent
            if (typeof parent === 'string') {
                const parentEl = document.querySelector(parent) as any as HTMLElement
                parentEl.appendChild(child.domElement)
            } else if (parent?.domElement) {
                parent.domElement.appendChild(child.domElement)
            }

            return child.domElement
        }

        const { renderer, scene } = trois
        if (!renderer.value || !scene.value) return

        // build object instance
        child.instance = createObject({ name, element: child })
        updateAllObjectProps({ element: child, props: child.props || {} })

        // notify parent if needed
        if (child.props?.attach) {
            parent.attached = {
                [child.props.attach]: child.instance,
                ...(parent?.attached || {})
            }
        }

        // save vue ID
        child.vueId = (child as any)?.__vueParentComponent?.uid
        if (child.vueId === null || child.vueId === undefined) {
            return
        }
        created[child.vueId] = child

        if (child && child.instance && isObject3D(child.instance)) {
            let parentNode = (child as any).__vueParentComponent?.vnode?.el
                ?? parent
            if (!Object.keys(parentNode).length) {
                parentNode = created[(child as any).__vueParentComponent?.parent?.uid ?? -1]
            }
            const parentInstance = parentNode?.instance
            child.parentNode = parentNode

            if (parent.type === 'canvas') {
                // we're a scene-level component, so let's go ahead and add ourselves to the scene
                scene.value.add(child.instance)

                // we'll also need to add any children who have added themselves to our creation queue
                child.children?.filter(Boolean).forEach(c => {
                    (child.instance as any as Object3D).add(c.instance as any as Object3D)
                })

                // reset children array
                // child.children = []
            } else if (parentInstance) {
                // if we're a child of an existing TroisInstance, add ourselves to that instance
                parentInstance.add(child.instance)
            } else if (parentNode) {
                // if we're a child of a nonexistant TroisInstance, tell the node we'll need to
                // be created when that instance is created
                parentNode.children.push(child)
            }
        }
    },

    remove: (el) => {
        const instance = el?.instance
        if (instance) {
            const uid = el.vueId ?? -1
            if (uid !== -1) {
                delete created[uid]
            }
            const parent = el?.parentNode?.instance ?? trois.scene.value
            parent?.remove(instance as any)
        }
    },

    createText: (text) => {
        // console.log('createText', { text })
        return createElement('', {})
    },

    createComment: (text) => {
        console.log('createComment', { text })
        return createElement('', {})
    },

    setText: (node, text) => {
        console.log('setText', { node, text })
    },

    setElementText: (node, text) => {
        console.log('setElementText', { node, text })
    },

    parentNode: (node) => {
        // console.log('parentNode', { node })
        return createElement('', {})
    },

    nextSibling: (node) => {
        // console.log('nextSibling', { node })
        return null
    },

    patchProp: (el, key, prevValue, nextValue) => {
        const { instance } = (el || {})

        // ignore if el is DOM element OR no ready target OR if internal Trois property
        if (el?.props?.isDom || !instance || key.startsWith('$')) return

        // update props
        updateObjectProp({ target: instance, key, value: nextValue })

        // console.log('patchProp', { el, key, prevValue, nextValue })
    }
}

export const createApp = ((root: Component) => {
    const app = createRenderer(nodeOps).createApp(root)

    // register all components
    Object.keys(components).forEach(key => {
        app.component(key, (components as any)[key])
    })

    // update mount function to match Trois.Node
    const { mount } = app
    app.mount = (root, ...args) => {
        const domElement = (typeof root === 'string' ? document.querySelector(root) : root) as HTMLElement
        const mounted = mount({ domElement } as any, ...args)
        // trois.subTree.value = mounted.$.subTree
        // trois.app.value = mounted
        return mounted
    }

    // done
    return app
})

export { extend } from './components'
export { useTrois }
export { scene, renderer } from './useThree'
