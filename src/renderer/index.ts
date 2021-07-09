import { createRenderer, Component } from 'vue'
import { RendererOptions } from '@vue/runtime-core'
import { createObject, updateAllObjectProps, updateObjectProp } from './objects'
import { isObject3D, pascalCase } from './lib'
import { components } from './components'
import { initTrois, useTrois } from './useThree'
const trois = useTrois()

const nodeOps: RendererOptions = {
    createElement: (type, isSvg, isCustomizedBuiltin, vnodeProps) => {
        const name = pascalCase(type)

        vnodeProps = vnodeProps || {}

        // debug
        // console.log('createElement', { name, type, isSvg, isCustomizedBuiltin, vnodeProps })

        // container node - this will be the first thing created
        if (vnodeProps.hasOwnProperty('data-trois-container')) {
            vnodeProps.isDom = true

            // pick trois props from wrapper
            const sceneOptions = {
                cameraPosition: [0, 0, 0] as [number, number, number],
                background: 'black',
                ...vnodeProps
            }

            // this is the root container, so let's start trois
            initTrois(sceneOptions)
        }

        if (vnodeProps.hasOwnProperty('data-trois-canvas')) {
            vnodeProps.isDom = true
        }

        // auto-attach geometries and materials
        if (name.endsWith('Geometry')) {
            vnodeProps.attach = vnodeProps.attach || 'geometry'
        }
        if (name.endsWith('Material')) {
            vnodeProps.attach = vnodeProps.attach || 'material'
        }

        let domElement = null
        if (vnodeProps.isDom) {
            // canvas has already been created by initTrois
            if (type === 'canvas') {
                domElement = trois.renderer.value?.domElement
            } else {
                domElement = document.createElement(type)
            }
        }

        // create trois element
        return {
            type,
            instance: null,
            domElement,
            props: vnodeProps
        }
    },

    insert: (el, parent, anchor) => {
        // debug
        // console.log('insert', el, parent, anchor)

        // convert type to PascalCase
        let name = ''
        if (el.type) {
            name = pascalCase(el.type)
        }

        // cancel if no valid name
        if (!name) return

        // mount dom elements
        if (el.domElement) {
            // apply styling
            Object.keys(el?.props?.style).forEach(key => {
                (el.domElement?.style ?? {} as any)[key] = (el?.props?.style ?? {})[key]
            })

            // attach container to parent
            if (typeof parent === 'string') {
                const parentEl = document.querySelector(parent) as any as HTMLElement
                parentEl.appendChild(el.domElement)
            } else if (parent?.domElement) {
                parent.domElement.appendChild(el.domElement)
            }

            return el.domElement
        }

        const { renderer, scene } = trois
        if (!renderer.value || !scene.value) return

        // build object instance
        el.instance = createObject({ name, vnodeProps: el.props })
        updateAllObjectProps({ target: el.instance, props: el.props || {} })

        // notify parent if needed
        // console.log(el, 'checking attach')
        if (el.props?.attach && parent?.props) {
            console.log('attach', el.props.attach)
            parent.props.attach = {
                [el.props.attach]: el.instance,
                ...(parent?.props?.attach || {})
            }
        }

        if (el.instance && isObject3D(el.instance)) {
            if (parent.type === 'canvas') {
                scene.value.add(el.instance)
            }
        }
    },

    remove: (el) => {
        console.log('remove', el)
    },



    createText: (text) => {
        // console.log('createText', { text })
        return {}
    },

    createComment: (text) => {
        // console.log('createComment', { text })
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

    const { mount } = app
    app.mount = (...args) => {
        const [root] = args
        const domElement = typeof root === 'string' ? document.querySelector(root) : root
        return mount({ domElement })
    }
    // app.mount = (containerOrSelector: Element | string): any => {
    //     const container = typeof containerOrSelector === 'string' ? document.querySelector(containerOrSelector) : containerOrSelector
    //     if (!container) return
    //     console.log('container', container)
    //     const proxy = mount.apply(app, [container])
    //     console.log('proxy', proxy)
    //     return proxy
    // }

    // done
    return app
})

export { extend } from './components'
export { useTrois }