import { Trois } from './types'

export const addEventListener = (
    { element, key, value }:
        { element: Trois.Element, key: Trois.EventKey, value: Function }
) => {
    // create new record for this key if needed
    if (!element.eventListeners[key]) {
        element.eventListeners[key] = []
    }

    // TODO: add event listener
    element.eventListeners[key].push(value)

    // TODO: event handling implementation
    // if we need it, let's get/create the main raycaster
    if (interactionsRequiringRaycaster.includes(key)) {

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