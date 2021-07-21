import { Trois } from './types'

export const addEventListener = (
    { element, key, value }:
        { element: Trois.Element, key: Trois.EventKey, value: Function }
) => {
    // create new record for this key if needed
    if (!element.eventListeners[key]) {
        element.eventListeners[key] = []
    }

    // TODO: add event listener if needed
    element.eventListeners[key].push(value)

    // TODO: event handling implementation

    return element
}