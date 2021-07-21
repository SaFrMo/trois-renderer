import { Object3D } from "three"
import { startCase } from 'lodash'
import { Trois } from './types'

// MAKE SURE THESE MATCH VALUES IN types.EventKey
export const isEventKey = (target: any): target is Trois.EventKey => {
    return [
        'onPointer',
        'onClick',
        'onDoubleClick',
        'onContextMenu',
        'onWheel',
    ].includes(target)
}

export const isObject3D = (target: any): target is Object3D => {
    return target?.isObject3D
}

export const pascalCase = (val: string) => {
    return startCase(val).replace(/\s+/g, '')
}

export const pathFromString = (o: any, s: string) => {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}