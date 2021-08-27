import * as THREE from 'three'
import { get, isNumber, set } from 'lodash'
import { isEventKey } from './lib'
import { catalogue } from '../components/components'
import { Trois } from '../types'
import { addEventListener } from '../events'
import { scene, renderer, camera } from './useThree'

/** Create a ThreeJS object from given vnode params. */
export const createObject = ({ name, element }: {
    name: string, element: Trois.Element
}) => {
    const vnodeProps = element.props
    const args = transformArgs(vnodeProps?.args ?? [])

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

    // look for $attached in args
    // we need to guarantee everything comes back as an array so we can spread $attachedArrays,
    // so we'll use processPropAsArray
    const argsWrappedInArrays = args.map((arg: any) => { return processPropAsArray({ element, prop: arg }) })
    let processedArgs = [] as Array<any>
    argsWrappedInArrays.forEach(arr => {
        processedArgs = processedArgs.concat(arr)
    })

    // return result
    const output = new targetClass(...processedArgs)
    return output
}

const transformArgs = (args: Array<any>) => {
    return args.map(arg => {

        // substitute values as needed
        switch (arg) {
            case '$camera':
                return camera
            case '$renderer':
                return renderer
            case '$scene':
                return scene
            default:
                return arg
        }
    })
}

/** Process props into either themselves or the $attached value */
export function processProp<T>({ element, prop }: { element: Trois.Element, prop: any }) {
    // return $attachedArray value if needed
    if (typeof prop === 'string' && prop.startsWith('$attachedArray')) {
        return element.attachedArray[prop.replace('$attachedArray.', '')] as any as T
    }

    // return $attached value if needed
    if (typeof prop === 'string' && prop.startsWith('$attached')) {
        return element.attached[prop.replace('$attached.', '')] as T
    }

    // otherwise, return plain value
    return prop as T
}

function processPropAsArray<T>({ element, prop }: { element: Trois.Element, prop: any }) {
    const isAttachedArray = typeof prop === 'string' && prop.startsWith('$attachedArray')
    const output = processProp<T>({ element, prop })
    return Array.isArray(output) && isAttachedArray ? output as Array<T> : [output]
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

export const updateAllObjectProps = ({ element, props }: { element: Trois.Element, props: Trois.VNodeProps }) => {
    const target = element?.instance
    if (!target || !element) return element

    // set props
    props = props || {}
    let output = element
    Object.keys(props).forEach(key => {
        output = updateObjectProp({ element, key, value: props[key] })
    })

    return output
}

/**
 * Update property on target THREE.Object3D.
 */
export const updateObjectProp = (
    { element, key, value }:
        {
            element: Trois.Element,
            key: string,
            value: any
        }) => {

    // handle and return early if prop is an event
    // (event list from react-three-fiber)
    if (isEventKey(key)) {
        return addEventListener({ element, key, value })
    }

    // handle and return early if prop is specific to Vue/Trois
    if (internalTroisVueKeys.includes(key)) return element

    // parse $attached values
    if (typeof value === 'string' && value.startsWith('$attached')) {
        const attachedName = value.replace('$attached.', '')
        value = get(element.attached, attachedName, null)
    }

    // set instance manually
    if (key === 'trois-instance') {
        element.instance = value
        return element
    }

    // save instance
    const target = element.instance

    // cancel if no target
    if (!target) return element

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
    } else if (liveProperty && liveProperty.set) {
        // if property has `set` method, use that (https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#shortcuts)
        const nextValueAsArray = Array.isArray(value) ? value : [value]
            ; (target as any)[finalKey].set(...nextValueAsArray)
    } else if (typeof liveProperty === 'function') {
        // if property is a function, let's try calling it
        const result = liveProperty.bind(element.instance)(...value)

        // pass the result to the parent
        // TODO: more robust
        if (element.parentNode) {
            element.parentNode.attached[finalKey] = result
        }
    } else if (get(target, finalKey, undefined) !== undefined) {
        set(target, finalKey, value)
    } else {
        // if you see this error in production, you might need to add `finalKey`
        // to `internalTroisVueKeys` below
        console.log(`No property ${finalKey} found on ${target}`)
    }

    // mark that we need to update material if needed
    const targetTypeRaw = target?.texture?.type || target?.type
    if (typeof targetTypeRaw === 'string') {
        const targetType = targetTypeRaw.toLowerCase()

        switch (true) {
            case targetType.includes('material'):
                target.needsUpdate = true
                break;
            case targetType.includes('camera') && target.updateProjectionMatrix:
                target.updateProjectionMatrix()
                break;
        }
    }

    return element
}

/** props that Trois intercepts and prevents passing to created instances */
const internalTroisVueKeys = [
    'args',
    'attach',
    'attachArray',
    'key',
    'onAdded',
    'onReady',
    'ref',
]