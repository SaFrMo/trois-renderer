import { Trois } from '../types'
import { createElement as createTroisElement } from '../trois'
import { initTrois, useTrois } from '../useThree'
const trois = useTrois()

export const createElement = (
    type: string,
    isSvg: boolean | undefined,
    isCustomizedBuiltin: string | undefined,
    vnodeProps: Trois.VNodeProps) => {

    // create trois element
    const element = createTroisElement(type, vnodeProps ?? {})

    // debug
    // console.log('createElement', { node: element, type, isSvg, isCustomizedBuiltin, vnodeProps })

    // container node - this should be the first thing created
    if (element.props?.hasOwnProperty('data-trois-container')) {
        element.props.isDom = true

        // this is the root container, so let's start trois
        initTrois(element.props)
    }

    // this is the canvas, so let's note that it's a dom element
    // if (element.props?.hasOwnProperty('data-trois-canvas')) {
    //     element.props.isDom = true
    // }

    // auto-attach geometries and materials
    if (element.name.endsWith('Geometry')) {
        element.props = { attach: 'geometry', ...element.props }
    }
    if (element.name.endsWith('Material')) {
        element.props = { attach: 'material', ...element.props }
    }

    if (element.props?.isDom) {
        element.domElement = document.createElement(type)
    }

    // return created element
    return element
}