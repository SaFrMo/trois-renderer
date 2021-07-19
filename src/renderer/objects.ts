import * as THREE from 'three'
import { get, isNumber, set } from 'lodash'
import { isObject3D } from './lib'
import { TroisProps } from './types-old'
import { catalogue } from './components'
import { Trois } from './types'

/** Create a ThreeJS object from given vnode params. */
export const createObject = ({ name, element }: {
    name: string, element: Trois.Element
}) => {
    const vnodeProps = element.props
    const args = vnodeProps?.args ?? []
    console.log('creating obj', vnodeProps)

    // create mesh
    if (name.toLowerCase().endsWith('mesh')) {
        // use default geometry & material if needed
        const geo = element.attached?.geometry ?? new THREE.BoxGeometry()
        const mat = element.attached?.material ?? new THREE.MeshBasicMaterial()
        args[0] = geo
        args[1] = mat
    }

    // create target
    const targetClass = catalogue[name] || (THREE as any)[name]
    if (!targetClass) throw `${name} is not part of the THREE namespace! Did you forget to extend? import {extend} from 'trois'; extend({app, YourComponent, ...})`

    // return result
    return new targetClass(...args)
}

export const propertyShortcuts: { [key: string]: string } = {
    'x': 'position.x',
    'y': 'position.y',
    'z': 'position.z',
}

export const nestedPropertiesToCheck = [
    '',
    'parameters'
]

export const updateAllObjectProps = ({ element, props }: { element: Trois.Element, props: TroisProps }) => {
    const target = element?.instance
    if (!target || !element) return target

    // set props
    props = props || {}
    let output = target
    Object.keys(props).filter(key => !key.startsWith('$')).forEach(key => {
        const updated = updateObjectProp({ target, key, value: props[key] })
        if (isObject3D(updated)) {
            output = updated
        }
    })

    // set $attached props
    Object.keys(props).filter(key => typeof props[key] === 'string' && props[key].startsWith('$attached')).forEach(key => {
        const attachedName = props[key].replace('$attached.', '')
        const value = get(element.attached, attachedName, null)

        console.log('$attached', key, value)

        // look for the relevant attachment
        const updated = updateObjectProp({ target, key, value })
        if (isObject3D(updated)) {
            output = updated
        }
    })

    return output
}

/**
 * Update property on target THREE.Object3D.
 */
export const updateObjectProp = (
    { target, key, value }:
        {
            target: Trois.Instance,
            key: string,
            value: any
        }) => {

    // cancel if no target
    if (!target) return null

    // update THREE property
    // get final key
    const camelKey = key.replace(/-/g, '.')
    let finalKey = propertyShortcuts[camelKey] || camelKey
    let liveProperty

    for (let i = 0; i < nestedPropertiesToCheck.length && !liveProperty; i++) {
        const nestedProperty = nestedPropertiesToCheck[i]
        const fullPath = [nestedProperty, finalKey].filter(Boolean).join('.')
        liveProperty = liveProperty = get(target, fullPath)
    }

    if (liveProperty && isNumber(value) && liveProperty.setScalar) {
        // if value is a number and the property has a `setScalar` method, use that
        liveProperty.setScalar(value)
    }
    else if (liveProperty && liveProperty.set) {
        // check if property type has `set` method (https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#shortcuts)
        const nextValueAsArray = Array.isArray(value) ? value : [value]
            // liveProperty.set(...nextValueAsArray)
            // console.log(finalKey)
            ; (target as any)[finalKey].set(...nextValueAsArray)
        // console.log('setting', target)
    } else if (get(target, finalKey, undefined) !== undefined) {
        set(target, finalKey, value)
    } else {
        // console.log(`No property ${finalKey} found on`, target)
    }

    // mark that we need to update material if needed
    const targetType = target?.texture?.type || target?.type
    if (typeof targetType === 'string' && targetType.toLowerCase().includes('material')) {
        target.needsUpdate = true
        console.log('updating', target)
    }

    return target
}