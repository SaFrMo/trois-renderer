import * as THREE from 'three'
import { VNodeProps } from '@vue/runtime-core'

/** Create a ThreeJS object from given vnode params. */
export const createObject = ({ name, vnodeProps }: {
    name: string, vnodeProps: (VNodeProps & {
        [key: string]: any;
    } | null | undefined)
}): THREE.Object3D | null => {
    vnodeProps = vnodeProps || {}
    const args = vnodeProps.args ?? []

    // create mesh
    if (name.endsWith('Mesh')) {
        // use default geometry & material if needed
        const geo = vnodeProps.$attach?.geometry ?? new THREE.BoxGeometry()
        const mat = vnodeProps.$attach?.material ?? new THREE.MeshBasicMaterial()
        args.push(geo, mat)
    }

    // create target
    const target = (THREE as any)[name]
    return target ? new target(...args) : null
}