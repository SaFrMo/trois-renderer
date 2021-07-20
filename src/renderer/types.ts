import { VNodeProps as vueVNodeProps } from 'vue'
import { Object3D } from 'three'

export declare namespace Trois {
    // based on r3f BaseInstance: https://github.com/pmndrs/react-three-fiber/blob/d3a149f9bdbc2176e77e7ac92e48686311917bde/packages/fiber/src/core/renderer.ts#L31-L40
    // these are the minimum requirements for any Trois object
    // (scene objects, user-defined objects, three/examples/jsm modules, etc)
    type BaseInstance = Omit<Object3D, 'parent' | 'children' | 'attach' | 'add' | 'remove' | 'raycast'> & {
        // r3f has this - TODO: needed?
        // __trois: {}

        parent: Instance | null
        children: Instance[]

        /** `attach` attaches a BaseInstance to its parent for use by the parent */
        attach?: string

        // custom attach/detach functions - TODO: implement?
        // attachFns?

        remove: (...object: Instance[]) => Instance
        add: (...object: Instance[]) => Instance

        // TODO: implement
        // raycast?: (raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) => void
    }

    interface Catalogue {
        [key: string]: {
            new(...args: any): Instance
        }
    }

    /**
     * A Trois renderer element. Contains information about the Vue component.
     * Also contains the actual created THREE object in `instance`.
     */
    type Element = {
        // TODO: add childCreationQueue and differentiate between that and Children
        attached: { [key: string]: any }
        children: Array<Node>
        domElement: HTMLElement | null
        eventListeners: Record<string, Function | Function[]> | null
        id: number
        instance: Instance | null
        name: string
        parentNode: Node | null
        props: VNodeProps
        type: string
        vueId: number,
    }

    /** 
     * A TroisJS object. Can be any kind of ThreeJS object, JSM module, user-defined objects, etc.
     * For most scene-level work. a Trois.Instance and a THREE.Object3D are the same thing.
     */
    type Instance = BaseInstance & { [key: string]: any }

    type Node = Element

    type VNodeProps = (vueVNodeProps & {
        [key: string]: any;
    } | null | undefined)
}