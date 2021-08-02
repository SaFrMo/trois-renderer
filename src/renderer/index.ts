import { createRenderer, Component } from '@vue/runtime-core'
import { components, extend } from './components/components'
import { Trois } from './types'
import { nodeOps } from './nodeOps'

/* created elements, sorted under instance UUID */
export const createdByUuid: { [key: string]: Trois.Element } = {}

// console.log('v1318')

export const createApp = ((root: Component) => {
    const app = createRenderer(nodeOps).createApp(root) as Trois.TroisApp

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
    app.extend = (targets: Record<string, any>) => {
        extend({ app, ...targets })
    }

    // done
    return app
})

export { extend } from './components/components'
export { useTrois } from './trois/useThree'
export { scene, renderer } from './trois/useThree'
