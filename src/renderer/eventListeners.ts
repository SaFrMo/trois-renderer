import { Trois } from './types'

export const addEventListener = (
    { element, key, value }:
        { element: Trois.Element, key: string, value: Function }
) => {
    if (!element.eventListeners[key]) {
        element.eventListeners[key] = []
    }

    // TODO: add event listener if needed
    element.eventListeners[key].push(value)

    // TODO: event handling implementation

    return element
}