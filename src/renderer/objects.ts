import * as THREE from 'three'
import { VNodeProps } from '@vue/runtime-core'
import { get, isNumber, set, camelCase } from 'lodash'
import { isObject3D } from './lib'
import { Instance, TroisProps } from './types'
import { catalogue } from './components'

/** Create a ThreeJS object from given vnode params. */
export const createObject = ({ name, vnodeProps }: {
    name: string, vnodeProps: (VNodeProps & {
        [key: string]: any;
    } | null | undefined)
}): THREE.Object3D | Instance | null => {
    vnodeProps = vnodeProps || {}
    const args = vnodeProps.args ?? []

    // create mesh
    if (name.endsWith('Mesh')) {
        // use default geometry & material if needed
        const geo = vnodeProps.$attach?.geometry ?? new THREE.BoxGeometry()
        const mat = vnodeProps.$attach?.material ?? new THREE.MeshBasicMaterial()
        args[0] = geo
        args[1] = mat
    }

    // create target
    const targetClass = catalogue[name] || (THREE as any)[name]
    const target = targetClass ? new targetClass(...args) : null
    // if (!target || !isObject3D(target)) { return null }

    // done
    return target
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

export const updateAllObjectProps = ({ target, props }: { target: THREE.Object3D | null, props: TroisProps }) => {
    if (!target) return target

    // set props
    props = props || {}
    let output = target
    Object.keys(props).filter(key => !key.startsWith('$')).forEach(key => {
        const updated = updateObjectProp({ target, key, value: props[key] })
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
            target: THREE.Object3D | null,
            key: string,
            value: any
        }) => {

    // cancel if no target
    if (!target) return null

    // update THREE property
    // get final key
    const camelKey = camelCase(key)
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
    } else {
        set(target, finalKey, value)
    }

    return target
}