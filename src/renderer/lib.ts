import { Object3D } from "three"
import { startCase } from 'lodash'
import { Trois } from './types'

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