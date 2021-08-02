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
    // console.log('createElement', { element, type, isSvg, isCustomizedBuiltin, vnodeProps })

    // container node - this should be the first thing created in the app
    if (element.props?.hasOwnProperty('data-trois-container') || element.type === 'TroisCanvas') {
        element.props.isDom = true
        element.props.isContainer = true

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
        const elType = type === 'TroisCanvas' ? 'div' : type
        element.domElement = document.createElement(elType)
        Object.keys(element.props?.containerStyle ?? {}).forEach((key: string) => {
            if (element.domElement) {
                element.domElement.style[key as any] = element.props.containerStyle[key]
            }
        })
    }

    // return created element
    return element
}