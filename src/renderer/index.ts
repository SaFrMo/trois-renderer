import { createRenderer, Component } from 'vue'
import { RendererOptions } from '@vue/runtime-core'
import { updateObjectProp } from './objects'
import { components } from './components'
import { useTrois } from './useThree'
import { Trois } from './types'
const trois = useTrois()
export const created: { [key: number]: Trois.Element } = {}
import { createElement, insert } from './nodeOps'
import { createElement as createTroisElement } from './trois'

/*
    Elements are `create`d from the outside in, then `insert`ed from the inside out.
*/

const nodeOps: RendererOptions<Trois.Node, Trois.Element> = {
    createElement,

    insert,

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
        return createTroisElement('', {})
    },

    createComment: (text) => {
        console.log('createComment', { text })
        return createTroisElement('', {})
    },

    setText: (node, text) => {
        console.log('setText', { node, text })
    },

    setElementText: (node, text) => {
        console.log('setElementText', { node, text })
    },

    parentNode: (node) => {
        // console.log('parentNode', { node })
        return createTroisElement('', {})
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
