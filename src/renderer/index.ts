import * as THREE from 'three'
import { createRenderer } from 'vue'
import { RendererOptions } from '@vue/runtime-core'
import { createObject } from './objects'
import { isObject3D } from './lib'
import { TroisNode } from './types'

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

const updateSize = ({ width, height }: { width: number, height: number }) => {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
}



const nodeOps: RendererOptions<TroisNode> = {
    insert: (el, parent, anchor) => {
        // convert type to PascalCase
        let name = ''
        if (el.type) {
            name = `${el.type[0].toUpperCase()}${el.type.slice(1)}`
        }

        // cancel if no valid name
        if (!name) return

        // cancel if no props
        if (!el.vnodeProps) return

        // debug
        console.log('insert', { name: el.type, el, parent, anchor })

        // mount container
        if (typeof parent === 'string') {
            // build container
            const container = document.createElement(el.type)
            Object.keys(el.vnodeProps.style).forEach(key => {
                if (!el.vnodeProps) return
                (container.style as any)[key] = el.vnodeProps.style[key]
            })
            // attach canvas child
            container.appendChild((el as any).canvas as HTMLElement)

            // attach container to parent
            const parentEl = document.querySelector(parent) as any as HTMLElement
            parentEl.appendChild(container)

            // resize listener
            const resizeObserver = new ResizeObserver(([container]) => {
                updateSize(container.contentRect)
            })
            resizeObserver.observe(container)
            updateSize({
                width: container.offsetWidth,
                height: container.offsetHeight
            })

            return container
        }

        // mount canvas
        if (el.type === 'canvas') {
            // build canvas
            parent.canvas = renderer.domElement
            Object.keys(el.vnodeProps.style).forEach((key) => {
                if (!el.vnodeProps) return
                (renderer.domElement.style as any)[key] = el.vnodeProps.style[key]
            })

            return renderer.domElement
        }

        // notify parent if needed
        if (el.vnodeProps.attach) {
            parent.vnodeProps.attach = {
                [el.vnodeProps.attach]: el.vnodeProps.target,
                ...(parent.vnodeProps.attach || {})
            }
        }

        // create three object
        el.vnodeProps.target = el.vnodeProps.target || createObject({ name, vnodeProps: el.vnodeProps })
        if (isObject3D(el.vnodeProps.target)) {
            // TODO: replace placeholder
            el.vnodeProps.target.position.z = -8
            scene.add(el.vnodeProps.target)
        }
    }
    ,

    remove: (el) => {
        console.log('remove', { el })
    },

    createElement: (type, isSvg, isCustomizedBuiltin, vnodeProps) => {
        const name = `${type[0].toUpperCase()}${type.slice(1)}`

        vnodeProps = vnodeProps || {}

        // console.log('createElement', { name, type, isSvg, isCustomizedBuiltin, vnodeProps })

        if (name === 'Canvas' || name === 'Div') {
            vnodeProps.isDom = true
        }

        // auto-attach geometries and materials
        if (name.endsWith('Geometry')) {
            vnodeProps.attach = 'geometry'
        }
        if (name.endsWith('Material')) {
            vnodeProps.attach = 'material'
        }
        if (name.endsWith('Mesh')) {
            console.log('leaving')
            return { type, vnodeProps }
        }

        // create THREE object
        vnodeProps.target = createObject({ name, vnodeProps })

        return { type, vnodeProps }
    },

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
        console.log('parentNode', { node })
        return {}
    },

    nextSibling: (node) => {
        console.log('nextSibling', { node })
        return null
    },

    patchProp: (el, key, prevValue, nextValue) => {
        // ignore if el is DOM element or no ready target
        if (el.vnodeProps.isDom) return

        // update THREE property
        // el.vnodeProps?.target[key]?.set(nextValue)

        // console.log('patchProp', { el, key, prevValue, nextValue })
    }
}

export const { createApp } = createRenderer(nodeOps)