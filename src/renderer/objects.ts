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
        console.log(vnodeProps)
        // if (!vnodeProps.geometry )

        // use default geometry & material if needed
        const geo = vnodeProps.attach?.geometry ?? new THREE.BoxGeometry()
        const mat = vnodeProps.attach?.material ?? new THREE.MeshBasicMaterial()
        args.push(geo, mat)
    }

    // create target
    const target = (THREE as any)[name]
    if (!target) return null
    const result = new target(...args)

    // handle attachments to parents
    // if (vnodeProps.attach) {
    //     parent.vnodeProps = {
    //         ...(parent.vnodeProps || {}),
    //         [el.vnodeProps.attach]: result
    //     }
    // }

    // save result
    // el.vnodeProps.target = result

    return result

}