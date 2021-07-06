import * as THREE from 'three'
import { RendererElement, RendererNode } from '@vue/runtime-core'

export const createObject = ({ el, name, parent }: { el: RendererNode, name: string, parent: RendererElement }): THREE.Object3D => {
    const args = []

    // create mesh
    if (name.endsWith('Mesh')) {
        // use default geometry & material if needed
        const geo = el.vnodeProps.geometry ?? new THREE.BoxGeometry()
        const mat = el.vnodeProps.material ?? new THREE.MeshBasicMaterial()
        args.push(geo, mat)
    }

    // create target
    const target = (THREE as any)[name]
    const result = new target(...args)

    // TODO: handle props and config options

    // handle attachments to parents
    if (el.vnodeProps.attach) {
        parent.vnodeProps = {
            ...(parent.vnodeProps || {}),
            [el.vnodeProps.attach]: result
        }
    }

    return result

}