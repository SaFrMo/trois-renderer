import { App, ToRefs } from '@vue/runtime-core'
import { Trois } from '../../renderer/types'
import * as CANNON from 'cannon-es'
import { addBeforeRender, removeBeforeRender } from '../../renderer/trois/useThree'
import { vPhysics } from './directives/v-physics'

interface PhysicsInterface {
    app: App<Trois.Element>
    trois: ToRefs<Trois.Internals>
    worldOptions?: CANNON.WorldOptions
}

export interface PhysicsTrois extends Trois.Internals {
    physicsWorld: CANNON.World
}

export const usePhysics = ({ app, trois, worldOptions }: PhysicsInterface) => {
    const pt = trois as any as PhysicsTrois
    pt.physicsWorld = new CANNON.World(worldOptions ?? {
        gravity: new CANNON.Vec3(0, -9.82, 0)
    })

    // prep update function
    let lastTime = Date.now() * 0.001
    const timeStep = 1 / 60
    const update = () => {
        const now = Date.now() * 0.001
        const delta = now - lastTime
        lastTime = now
        pt.physicsWorld.step(timeStep, delta)
    }
    addBeforeRender(update)

    // register v-physics directive
    app.directive('physics', vPhysics({
        addBeforeRender,
        removeBeforeRender,
        world: pt.physicsWorld
    }))
}