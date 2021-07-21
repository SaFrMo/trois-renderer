import { Trois } from './types'
import { addInteractable, getOrCreateMainInteractionRaycaster } from './useThree'

export const addEventListener = (
    { element, key, value }:
        { element: Trois.Element, key: Trois.EventKey, value: Trois.InteractionCallback }
) => {
    // create new record for this key if needed
    if (!element.eventListeners[key]) {
        element.eventListeners[key] = []
    }

    // TODO: add event listener
    element.eventListeners[key].push(value)

    // if we need it, let's get/create the main raycaster
    if (interactionsRequiringRaycaster.includes(key)) {
        getOrCreateMainInteractionRaycaster()

        if (element.instance) {
            addInteractable(element)
        }

    }

    return element
}

const interactionsRequiringRaycaster = [
    'onClick',
    'onContextMenu',
    'onDoubleClick',
    'onPointerUp',
    'onPointerDown',
    'onPointerOver',
    'onPointerOut',
    'onPointerEnter',
    'onPointerLeave',
    'onPointerMove',
    'onPointerMissed',
]