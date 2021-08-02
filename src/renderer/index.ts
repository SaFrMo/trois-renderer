import { createRenderer, Component } from '@vue/runtime-core'
import { components } from './components'
import { useTrois } from './useThree'
import { Trois } from './types'
const trois = useTrois()
import { nodeOps } from './nodeOps'

/* created elements, sorted under instance UUID */
export const createdByUuid: { [key: string]: Trois.Element } = {}

// console.log('v1318')

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
        return mounted
    }
    // TODO: add `extend` function here rather than separate export?

    // done
    return app
})

export { extend } from './components'
export { useTrois }
export { scene, renderer } from './useThree'
