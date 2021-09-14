import { Trois } from '../types'
import { createElement as createTroisElement } from '../trois'
import { initTrois, useTrois } from '../trois/useThree'
const trois = useTrois()
import { createRoot, root, tree } from '../trois/tree'
export const createdUuids: Array<string> = []

const isContainer = (element: Trois.Element) => {
    return element.props?.hasOwnProperty('data-trois-container') || element.name === 'TroisCanvas'
}

export const createElement = (
    type: string,
    isSvg: boolean | undefined,
    isCustomizedBuiltin: string | undefined,
    vnodeProps: Trois.VNodeProps) => {

    // create trois element
    const element = createTroisElement(type, vnodeProps ?? {})

    // debug
    // console.log('createElement', { element, type, isSvg, isCustomizedBuiltin, vnodeProps })

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

    // container node - this should be the first thing created in the app
    if (isContainer(element)) {
        element.props.isDom = true
        element.props.isContainer = true

        // initialize trois
        initTrois(element.props)

        // create container element
        const elType = isContainer(element) ? 'div' : type
        element.domElement = document.createElement(elType)

        element.domElement.style.position = 'absolute'
        element.domElement.style.top = '0'
        element.domElement.style.left = '0'
        element.domElement.style.width = '100%'
        element.domElement.style.height = '100%'

        createRoot(element.uuid)
    }

    // add element to tree
    // else {
    //     root.addChild(tree.parse(element.uuid))
    // }
    // createdUuids.push(element.uuid)

    // return created element
    return element
}