import { Directive } from "@vue/runtime-core"
import { Trois } from "../../../renderer/types"
import { Mesh, Quaternion, Vector3 } from 'three'
import * as CANNON from 'cannon-es'

interface VPhysicsOptions {
    addBeforeRender: (cb: Trois.UpdateCallback) => void
    removeBeforeRender: (cb: Trois.UpdateCallback) => void
    world: CANNON.World
}



export const vPhysics = ({ addBeforeRender, removeBeforeRender, world }: VPhysicsOptions) => {
    let update: () => void
    let body: CANNON.Body

    return {
        mounted(el, binding) {
            const instance = el?.instance as Mesh
            if (!instance) throw 'Instance required for v-physics directive'

            // get this item's position before adding to physics world
            const worldPosition = instance.getWorldPosition(new Vector3())
            const worldRotation = instance.getWorldQuaternion(new Quaternion())

            // get item's geometry
            const geo = instance.geometry
            if (!geo) throw 'v-physics should be attached to a mesh with a geometry property'

            // get item's args
            const args = el?.props?.args

            // translate geo to cannon body
            let shape
            const geoType = geo.type.toLowerCase()
            const scale = new Vector3()

            // build a box
            if (geoType.includes('box')) {
                scale.set(args?.[0] ?? 1, args?.[1] ?? 1, args?.[2] ?? 1)
                scale.multiplyScalar(0.5)
                shape = new CANNON.Box(new CANNON.Vec3(scale.x, scale.y, scale.z))
            } else if (geoType.includes('sphere') || geoType.includes('icosahedron')) {
                // build a sphere
                shape = new CANNON.Sphere(args[0] ?? 1)
            } else if (geoType.includes('plane')) {
                // build a plane
                shape = new CANNON.Plane()
            } else {
                // not supported
                console.log(`trois physics does not currently support ${geo.type}`)
                return
            }

            // create and add body
            body = new CANNON.Body({
                position: new CANNON.Vec3(worldPosition.x, worldPosition.y, worldPosition.z),
                quaternion: new CANNON.Quaternion(worldRotation.x, worldRotation.y, worldRotation.z, worldRotation.w),
                shape,
                mass: 1,
                ...(binding ?? {})
            })
            world.addBody(body)
            console.log('added', body.position)

            // register update
            update = () => {
                console.log('TODO: why is only 1 id running?', body.id)
                instance.position.copy(body.position as any)
                instance.quaternion.copy(body.quaternion as any)
            }
            addBeforeRender(update)
        },
        beforeUnmount() {
            // cleanup
            if (update) {
                removeBeforeRender(update)
            }
            if (world && body) {
                world.removeBody(body)
            }
        }
    } as Directive
}