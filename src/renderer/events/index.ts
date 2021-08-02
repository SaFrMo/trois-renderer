import { Trois } from '../types'
import { addInteractable, currentIntersections, getOrCreateMainInteractionRaycaster, interactables, removeInteractable, useTrois } from '../trois/useThree'
import { ToRefs, watch } from '@vue/runtime-core'
let trois: ToRefs<Trois.Internals>

export const addEventListener = (
    { element, key, value }:
        { element: Trois.Element, key: Trois.EventKey, value: Trois.InteractionCallback }
) => {
    // create new records for this key if needed
    if (!element.eventListeners[key]) {
        element.eventListeners[key] = []
    }
    if (!element.eventListenerRemoveFunctions[key]) {
        element.eventListenerRemoveFunctions[key] = []
    }

    // add event listener
    element.eventListeners[key].push(value)

    // if we need it, let's get/create the main raycaster
    if (interactionsRequiringRaycaster.includes(key)) {
        getOrCreateMainInteractionRaycaster()

        if (element.instance && !interactables.includes(element)) {
            addInteractable(element)
            element.eventListenerRemoveFunctions[key].push(() => removeInteractable(element))
        }
    }

    // register click, pointerdown, pointerup
    if (key === 'onClick' || key === 'onPointerDown' || key === 'onPointerUp') {
        trois = trois ?? useTrois()
        const stop = watch(() => trois.mouseDown.value, isDown => {
            const idx = currentIntersections.map(v => v.element).findIndex(v => v.instance?.uuid === element.instance?.uuid)
            if (idx !== -1) {
                if (isDown && (key === 'onClick' || key === 'onPointerDown')) {
                    element.eventListeners[key].forEach(func => {
                        func({ intersection: currentIntersections[idx].intersection })
                    })
                } else if (!isDown && key === 'onPointerUp') {
                    element.eventListeners[key].forEach(func => {
                        func({ intersection: currentIntersections[idx].intersection })
                    })
                }
            }
        })

        element.eventListenerRemoveFunctions[key].push(stop)
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