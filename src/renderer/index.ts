import * as THREE from 'three'
import { createRenderer } from 'vue'
import { RendererElement, RendererOptions } from '@vue/runtime-core'

import { canvas } from './canvas'

// TODO: replace placeholder
const camera = new THREE.PerspectiveCamera(45, 0.5625, 1, 1000)
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const update = () => {
    requestAnimationFrame(update)
    renderer.render(scene, camera)
}
update()

const nodeOps: RendererOptions = {
    insert: (el, parent, anchor) => {
        let name = ''
        if (el.type) {
            name = `${el.type[0].toUpperCase()}${el.type.slice(1)}`
        }

        console.log('insert', { name: el.type, el, parent, anchor })

        // mount root instance
        if (typeof parent === 'string') {
            parent = document.querySelector(parent) as any
            document.body.appendChild(renderer.domElement)

            return
        }

        const args = []

        // create mesh
        if (name.endsWith('Mesh')) {
            args.push(el.vnodeProps.geometry, el.vnodeProps.material)
        }
        if (name.endsWith('Material')) {
            args.push({ color: el.vnodeProps.color })
        }

        // create target
        const target = (THREE as any)[name]
        const result = new target(...args)

        // TODO: handle props and config options

        // handle attachments to parents
        if (el.vnodeProps.attach) {
            parent.vnodeProps = {
                ...(parent.vnodeProps || {}),
                [el.vnodeProps.attach]: result
            }
        }

        if (result.isObject3D) {
            // TODO: replace placeholder
            result.position.z = -4
            scene.add(result)
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

        // console.log('createElement', { type, isSvg, isCustomizedBuiltin, vnodeProps })
        // const target = (THREE as any)[name]
        // return new target(vnodeProps)

        // auto-attach geometries and materials
        if (name.endsWith('Geometry')) {
            vnodeProps = { attach: 'geometry', ...vnodeProps }
        }
        if (name.endsWith('Material')) {
            vnodeProps = { attach: 'material', ...vnodeProps }
        }

        return { type, vnodeProps }
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