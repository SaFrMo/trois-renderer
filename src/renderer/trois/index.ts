import { Trois } from '../types'
import { Constants } from './constants'
import { pascalCase } from './lib'
import { v4 as uuidv4 } from 'uuid'

/**
 * Creates a new Trois.Element with the given options.
 * @returns New Trois.Element.
 */
export const createElement = (type: string, props: Trois.VNodeProps = {}) => {
    const t: Trois.Element = {
        attached: {},
        attachedArray: {},
        childCreationQueue: [],
        children: [],
        domElement: null,
        eventListeners: {} as Record<Trois.EventKey, Trois.InteractionCallback[]>,
        eventListenerRemoveFunctions: {} as Record<Trois.EventKey, Function[]>,
        instance: null,
        name: pascalCase(type),
        uuid: uuidv4(),
        parentNode: null,
        props,
    }

    return t
}