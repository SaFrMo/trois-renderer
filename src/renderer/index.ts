import { createRenderer, Component, watchEffect } from 'vue'
import { RendererOptions } from '@vue/runtime-core'
import { createObject, updateAllObjectProps, updateObjectProp } from './objects'
import { isObject3D, pascalCase } from './lib'
import { components } from './components'
import { initTrois, useTrois } from './useThree'
import { Trois } from './types'
const trois = useTrois()
let nodeId = 0

const remove = (el: Trois.Element) => {
    // console.log('remove', el)
}

const nodeOps: RendererOptions<Trois.Node, Trois.Element> = {
    createElement: (type, isSvg, isCustomizedBuiltin, vnodeProps) => {
        const node: Trois.Element = {
            id: nodeId++,
            type,
            instance: null,
            domElement: null,
            props: vnodeProps || {},
            children: [],
            parentNode: null,
            eventListeners: null
        }

        const name = pascalCase(type)

        // debug
        console.log('createElement', { name, node, type, isSvg, isCustomizedBuiltin, vnodeProps })

        // container node - this will be the first thing created
        if (node.props?.hasOwnProperty('data-trois-container')) {
            node.props.isDom = true

            // pick trois props from wrapper
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
        if (name.endsWith('Geometry')) {
            node.props = { attach: 'geometry', ...node.props }
        }
        if (name.endsWith('Material')) {
            node.props = { attach: 'material', ...node.props }
        }

        if (node.props?.isDom) {
            // canvas has already been created by initTrois
            if (type === 'canvas') {
                node.domElement = trois.renderer.value?.domElement
            } else {
                node.domElement = document.createElement(type)
            }
        }

        // create trois element
        return node
    },

    insert: (child, parent, ref?: Trois.Element | null) => {
        // debug
        // console.log('insert', el, parent, anchor)

        // calculate the ref index because the child's removal may have affected it
        parent.children = parent.children || []
        const refIndex = ref ? parent.children.indexOf(ref) : -1
        if (refIndex === -1) {
            console.log(child)
            // child not present in scene yet (v-if, for example)
            parent.children?.push(child)
            child.parentNode = parent
        } else {
            parent.children?.splice(refIndex, 0, child)
            child.parentNode = parent
        }

        // convert type to PascalCase
        let name = ''
        if (child.type) {
            name = pascalCase(child.type)
        }

        // console.log(child)

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
        child.instance = createObject({ name, vnodeProps: child.props })
        updateAllObjectProps({ target: child.instance, props: child.props || {} })

        console.log(child)

        // notify parent if needed
        // console.log(el, 'checking attach')
        if (child.props?.attach && parent?.props) {
            // console.log('attach', child.props.attach)
            parent.props.attach = {
                [child.props.attach]: child.instance,
                ...(parent?.props?.attach || {})
            }
        }

        if (child.instance && isObject3D(child.instance)) {
            if (parent.type === 'canvas') {
                scene.value.add(child.instance)
            }
        }
    },

    remove,



    createText: (text) => {
        // console.log('createText', { text })
        return {}
    },

    createComment: (text) => {
        console.log('createComment', { text })
        return {}
    },

    setText: (node, text) => {
        console.log('setText', { node, text })
    },

    setElementText: (node, text) => {
        console.log('setElementText', { node, text })
    },

    parentNode: (node) => {
        // console.log('parentNode', { node })
        return {}
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
        const mounted = mount({ domElement }, ...args)
        // trois.subTree.value = mounted.$.subTree
        // trois.app.value = mounted
        return mounted
    }

    // done
    return app
})

export { extend } from './components'
export { useTrois }