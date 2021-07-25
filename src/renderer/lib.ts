import { Object3D, PMREMGenerator, UnsignedByteType } from "three"
import { startCase } from 'lodash'
import { Trois } from './types'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { watch } from "@vue/runtime-core"
import { useTrois } from './'

let pmremGenerator: PMREMGenerator
let rgbeLoader: RGBELoader

export const setupEnvMap = ({ src, scene }: { src: string, scene: THREE.Scene }) => {
    const trois = useTrois()

    watch(() => trois.renderer.value, async renderer => {
        console.log('running')
        if (!renderer) return

        // create pmremGenerator if needed
        if (!pmremGenerator) {
            pmremGenerator = new PMREMGenerator(renderer)
            pmremGenerator.compileEquirectangularShader()
        }

        // create loader if needed
        if (!rgbeLoader) {
            rgbeLoader = new RGBELoader()
            rgbeLoader.setDataType(UnsignedByteType)
        }

        // load and process texture
        const texture = await new Promise<THREE.DataTexture>((res, rej) => {
            rgbeLoader.load(src, res, undefined, rej)
        })
        const envMap = pmremGenerator.fromEquirectangular(texture).texture
        pmremGenerator.dispose()

        // add env map to scene
        if (envMap) {
            scene.environment = envMap
        }

    }, { immediate: true })
}

// MAKE SURE THESE MATCH VALUES IN types.EventKey
export const isEventKey = (target: any): target is Trois.EventKey => {
    return [
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
        // 'onUpdate',
        'onWheel',
    ].includes(target)
}

export const isObject3D = (target: any): target is Object3D => {
    return target?.isObject3D
}

export const pascalCase = (val: string) => {
    return startCase(val).replace(/\s+/g, '')
}