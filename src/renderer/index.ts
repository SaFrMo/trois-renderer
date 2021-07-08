import * as THREE from 'three'
import { App, createRenderer, Component } from 'vue'
import { RendererOptions } from '@vue/runtime-core'
import { createObject, updateAllObjectProps, updateObjectProp } from './objects'
import { isObject3D, pascalCase, pathFromString } from './lib'
import { isNumber, pick } from 'lodash'
import { components } from './components'
import { initTrois, useTrois } from './useThree'
import { PerspectiveCamera } from 'three'
import { TroisNode } from './types-old'


const updateSize = ({ width, height }: { width: number, height: number }) => {
    const trois = useTrois()
    if (!trois) return

    const { camera, renderer } = trois

    if (!renderer.value) return

    const perspectiveCamera = camera.value as PerspectiveCamera

    perspectiveCamera.aspect = width / height
    perspectiveCamera.updateProjectionMatrix()
    renderer.value.setSize(width, height)

    trois.size.value = { width, height }
}

const nodeOps: RendererOptions<TroisNode> = {
    createElement: (type, isSvg, isCustomizedBuiltin, vnodeProps) => {
        const name = pascalCase(type)

        vnodeProps = vnodeProps || {}

        // console.log('createElement', { name, type, isSvg, isCustomizedBuiltin, vnodeProps })

        if (name === 'Div') {
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

        // auto-attach geometries and materials
        if (name.endsWith('Geometry')) {
            vnodeProps.attach = vnodeProps.attach || 'geometry'
        }
        if (name.endsWith('Material')) {
            vnodeProps.attach = vnodeProps.attach || 'material'
        }
        if (name.endsWith('Mesh')) {
            // wait for mesh till we have children
            // TODO: replace with something reactive
            return { type, vnodeProps }
        }

        // create THREE object
        try {
            vnodeProps.target = createObject({ name, vnodeProps })
        } catch (err) {
            // console.log(err, vnodeProps)
        }

        console.log(type, vnodeProps)

        return { type, vnodeProps }
    },

    insert: (el, parent, anchor) => {
        // convert type to PascalCase
        let name = ''
        if (el.type) {
            name = pascalCase(el.type)
        }

        // cancel if no valid name
        if (!name) return

        // cancel if no props
        if (!el.vnodeProps) return

        // debug
        // console.log('insert', { name: el.type, el, parent, anchor })

        // mount container
        if (typeof parent === 'string') {
            // build container
            const container = document.createElement(el.type)
            Object.keys(el.vnodeProps.style).forEach(key => {
                if (!el.vnodeProps) return
                (container.style as any)[key] = (el.vnodeProps.style as any)[key]
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

        const trois = useTrois()
        const { renderer, scene } = trois
        if (!renderer.value || !scene.value) return

        // mount canvas
        if (el.type === 'canvas') {
            // build canvas
            parent.canvas = renderer.value.domElement
            Object.keys(el.vnodeProps.style).forEach((key) => {
                if (!el.vnodeProps || !renderer.value) return
                    ; (renderer.value.domElement.style as any)[key] = (el.vnodeProps.style as any)[key]
            })

            return renderer.value.domElement
        }

        // create three object if needed
        if (!el.target) {
            el.target = createObject({ name, vnodeProps: el.vnodeProps })
            updateAllObjectProps({ target: el.target, props: el.vnodeProps })
        }

        // console.log('adding to scene', el, parent)


        // notify parent if needed
        if (el.vnodeProps.attach) {
            parent.vnodeProps.attach = {
                [el.vnodeProps.attach]: el.target,
                ...(parent?.vnodeProps?.attach || {})
            }
        }

        if (el.target && isObject3D(el.target)) {
            if (parent.type === 'canvas') {
                scene.value.add(el.target)
            }
        }
    },

    remove: (el) => {
        console.log('remove', { el })
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
        const { target } = (el || {})

        // ignore if el is DOM element OR no ready target OR if internal Trois property
        if (el.vnodeProps.isDom || !target || key.startsWith('$')) return

        // update props
        updateObjectProp({ target: target, key, value: nextValue })

        // console.log('patchProp', { el, key, prevValue, nextValue })
    }
}

export const createApp = (root: Component) => {
    const app = createRenderer(nodeOps).createApp(root)

    // register all components
    Object.keys(components).forEach(key => {
        app.component(key, (components as any)[key])
    })

    // done
    return app
}

export { extend } from './components'
export { useTrois }