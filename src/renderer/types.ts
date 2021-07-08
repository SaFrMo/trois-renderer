declare namespace Trois {
    // based on r3f BaseInstance: https://github.com/pmndrs/react-three-fiber/blob/d3a149f9bdbc2176e77e7ac92e48686311917bde/packages/fiber/src/core/renderer.ts#L31-L40
    // these are the minimum requirements for any Trois object
    // (scene objects, user-defined objects, three/examples/jsm modules, etc)
    type BaseInstance = {
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

    /** A TroisJS object. Can be any kind of ThreeJS object, JSM module, user-defined objects, etc. */
    type Instance = BaseInstance & { [key: string]: any }
}