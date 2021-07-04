import * as THREE from 'three'
import { createRenderer } from 'vue'
import { RendererElement, RendererOptions } from '@vue/runtime-core'

import { canvas } from './canvas'

const nodeOps: RendererOptions = {
    insert: (el, parent, anchor) => {
        console.log('insert', { el, parent, anchor })

        if (typeof parent === 'string') {
            parent = document.querySelector(parent) as any
            (parent as HTMLElement).appendChild(el as HTMLElement)
        }
    },

    remove: (el) => {
        console.log('remove', { el })
    },

    createElement: (type, isSvg, isCustomizedBuiltin, vnodeProps) => {
        const name = `${type[0].toUpperCase()}${type.slice(1)}`
        if (name === 'TroisCanvas') {
            return canvas()
        }

        console.log('createElement', { type, isSvg, isCustomizedBuiltin, vnodeProps })
        const target = (THREE as any)[name]
        return new target(vnodeProps)
    },

    createText: (text) => {
        console.log('createText', { text })
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
        console.log('parentNode', { node })
        return {}
    },

    nextSibling: (node) => {
        console.log('nextSibling', { node })
        return {}
    },

    patchProp: (el, key, prevValue, nextValue) => {
        console.log('patchProp', { el, key, prevValue, nextValue })
    }
}

export const { createApp } = createRenderer(nodeOps)