import { RendererOptions } from 'vue'
import { Trois } from '../types'
import { createElement } from './createElement'
import { createElement as createTroisElement } from '../trois'
import { updateObjectProp } from '../trois/objects'
import { insert } from './insert'
import { remove } from './remove'

/*
    Elements are `create`d from the outside in, then `insert`ed from the inside out.
*/

export const nodeOps: RendererOptions<Trois.Node, Trois.Element> = {
    createElement,

    insert,

    remove,

    createText: (text) => {
        // console.log('createText', { text })
        return createTroisElement('', {})
    },

    createComment: (text) => {
        // console.log('createComment', { text })
        return createTroisElement('', {})
    },

    setText: (node, text) => {
        // console.log('setText', { node, text })
    },

    setElementText: (node, text) => {
        // console.log('setElementText', { node, text })
    },

    parentNode: (node) => {
        // console.log('parentNode', { node })
        return createTroisElement('', {})
    },

    nextSibling: (node) => {
        // console.log('nextSibling', { node })
        return null
    },

    patchProp: (element, key, prevValue, nextValue) => {
        const { instance } = (element || {})

        // ignore if el is DOM element OR no ready target OR if internal Trois property
        if (element?.props?.isDom || !instance || key.startsWith('$')) return

        // update props
        updateObjectProp({ element, key, value: nextValue })

        // console.log('patchProp', { el, key, prevValue, nextValue })
    }
}