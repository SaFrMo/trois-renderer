import { isEventKey } from '../lib'
import { Trois } from '../types'

export const remove = (element: Trois.Element) => {
    // remove from parent if needed
    element.instance?.parent?.remove(element.instance)
    // dispose if needed
    element.instance?.dispose?.()
    // remove event listeners if needed
    Object.keys(element.eventListenerRemoveFunctions).forEach((evtKey: string) => {
        if (!isEventKey(evtKey)) {
            throw 'incorrect event key: ' + evtKey
        }
        element.eventListenerRemoveFunctions[evtKey].forEach(f => f())
    })

    // run on children
    element.children.forEach(child => {
        remove(child)
    })
}