import { Object3D } from "three"
import { startCase } from 'lodash'

export const isObject3D = (target: any): target is Object3D => {
    return target.isObject3D
}

export const pascalCase = (val: string) => {
    return startCase(val).replace(/\s+/g, '')
}