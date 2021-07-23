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

    // auto-attach relevant values
    trois.autoAttach.value.forEach(key => {
        if (element.name.toLowerCase().endsWith(key)) {
            element.props = { attach: key, ...element.props }
        }
    })
    trois.autoAttachArray.value.forEach(key => {
        if (element.name.toLowerCase().endsWith(key)) {
            element.props = { attachArray: key, ...element.props }
        }
    })

    if (element.props?.isDom) {
        element.domElement = document.createElement(type)
    }

    // return created element
    return element
}