import { Object3D } from "three"

export const isObject3D = (target: any): target is Object3D => {
    return target.isObject3D
}