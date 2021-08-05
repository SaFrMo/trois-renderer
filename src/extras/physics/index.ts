import { App, ToRefs } from '@vue/runtime-core'
import { Trois } from '../../renderer/types'
import * as CANNON from 'cannon-es'
import { addBeforeRender, removeBeforeRender } from '../../renderer/trois/useThree'
import { vPhysics } from './directives/v-physics'
import { Mesh, Vector3 } from 'three'

interface PhysicsInterface {
    app: App<Trois.Element>
    trois: ToRefs<Trois.Internals>
    worldOptions?: CANNON.WorldOptions
}

export interface PhysicsTroisMeta {
    world: CANNON.World
    dictionary: Array<{ body: CANNON.Body, mesh: Mesh, uuid: string }>
}

export interface PhysicsTrois extends Trois.Internals {
    physics: PhysicsTroisMeta
}

export const usePhysics = ({ app, trois, worldOptions }: PhysicsInterface) => {
    const pt = trois as any as PhysicsTrois

    pt.physics = {
        world: new CANNON.World(worldOptions ?? {
            gravity: new CANNON.Vec3(0, -9.82, 0)
        }),
        dictionary: []
    }

    // prep update function
    let lastTime = Date.now() * 0.001
    const timeStep = 1 / 60
    const scratch = new Vector3()

    const update = () => {
        const now = Date.now() * 0.001
        const delta = now - lastTime
        lastTime = now
        pt.physics.world.step(timeStep, delta)

        pt.physics.dictionary.forEach(({ body, mesh, uuid }) => {
            // scratch.set(body.position.x, body.position.y, body.position.z)
            // scratch = mesh.worldToLocal(scratch)
            // mesh.position.copy(scratch.clone())
            //  mesh.getWorldPosition(scratch)
            mesh.position.copy(body.position as any)
            mesh.quaternion.copy(body.quaternion as any)
        })
    }
    addBeforeRender(update)

    // register v-physics directive
    app.directive('physics', vPhysics({
        addBeforeRender,
        removeBeforeRender,
        physics: pt.physics
    }))
}