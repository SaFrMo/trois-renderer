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

        // build trois props from wrapper
        const sceneOptions: Trois.SceneOptions = {
            antialias: true,
            background: 'black',
            cameraPosition: [0, 0, 0] as [number, number, number],
            ...vnodeProps
        }

        // this is the root container, so let's start trois
        initTrois(sceneOptions)
    }

    // this is the canvas, so let's note that it's a dom element
    if (element.props?.hasOwnProperty('data-trois-canvas')) {
        element.props.isDom = true
    }

    // auto-attach geometries and materials
    if (element.name.endsWith('Geometry')) {
        element.props = { attach: 'geometry', ...element.props }
    }
    if (element.name.endsWith('Material')) {
        element.props = { attach: 'material', ...element.props }
    }

    // check to make sure renderer is running
    if (!trois.renderer.value) {
        throw 'Renderer not initialized.'
    }

    if (element.props?.isDom) {
        // we know the canvas has already been created by initTrois,
        // so let's attach it to the Trois.Element here
        if (type === 'canvas') {
            element.domElement = trois.renderer.value.domElement
        } else {
            // otherwise, create the relevant HTML element
            element.domElement = document.createElement(type)
        }
    }

    // return created element
    return element
}