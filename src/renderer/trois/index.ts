import { Trois } from '../types'
import { Constants } from './constants'
import { pascalCase } from '../lib'

let nodeId = 0

/**
 * Creates a new Trois.Element with the given options.
 * @returns New Trois.Element.
 */
export const createElement = (type: string, props: Trois.VNodeProps = {}) => {
    return {
        attached: {},
        childCreationQueue: [],
        children: [],
        domElement: null,
        eventListeners: null,
        id: nodeId++,
        instance: null,
        name: pascalCase(type),
        parentNode: null,
        props,
        type,
        vueId: Constants.UNKNOWN,
    } as Trois.Element
}