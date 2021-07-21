import { VNodeProps as vueVNodeProps } from 'vue'

export declare namespace Trois {
    // based on r3f BaseInstance: https://github.com/pmndrs/react-three-fiber/blob/d3a149f9bdbc2176e77e7ac92e48686311917bde/packages/fiber/src/core/renderer.ts#L31-L40
    // these are the minimum requirements for any Trois object
    // (scene objects, user-defined objects, three/examples/jsm modules, etc)
    type BaseInstance = Omit<THREE.Object3D, 'parent' | 'children' | 'attach' | 'add' | 'remove' | 'raycast'> & {
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
        attached: { [key: string]: any }
        childCreationQueue: Array<Element>
        children: Array<Element>
        domElement: HTMLElement | null
        eventListeners: Record<EventKey, Function[]>
        id: number
        instance: Instance | null
        name: string
        parentNode: Element | null
        props: VNodeProps
        type: string
        vueId: number,
    }

    // MAKE SURE THESE MATCH VALUES IN lib.isEventKey
    type EventKey =
        'onClick' |
        'onContextMenu' |
        'onDoubleClick' |
        'onPointerUp' |
        'onPointerDown' |
        'onPointerOver' |
        'onPointerOut' |
        'onPointerEnter' |
        'onPointerLeave' |
        'onPointerMove' |
        'onPointerMissed' |
        // 'onUpdate' |
        'onWheel'

    /** 
     * A TroisJS object. Can be any kind of ThreeJS object, JSM module, user-defined objects, etc.
     * For most scene-level work. a Trois.Instance and a THREE.Object3D are the same thing.
     */
    type Instance = BaseInstance & { [key: string]: any }

    // based on r3f useThree: https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#usethree
    type Internals = {
        initialized: boolean,
        renderer: THREE.WebGLRenderer | null,
        scene: THREE.Scene | null,
        camera: THREE.Camera | null,
        size: {
            width: number,
            height: number,
        },
        raycaster: THREE.Raycaster | null

        // app: null | ComponentPublicInstance
        // subTree: {
        //   [key: string]: any
        // } | null

        // not yet implemented (copied from r3f):
        /*
      mouse, // THREE.Vector2
      clock, // THREE.Clock
      vr, // boolean
      linear, // Colorspace, boolean
      frameloop, // 'always' | 'demand' | 'never'
      performance: {
        current, // Current performance status, must be between min and max, number
        min, // Performance lower bounds, number
        max, // Performance upper bounds, number
        debounce, // Debounce timeout, number
        regress, // Flag regression, () => void
      },
      size: {
        width, // Canvas width in pixels, number;
        height, // Canvas height in pixels, number;
      },
      viewport: {
        width, // Viewport width in units, number;
        height, // Viewport height in units, number;
        initialDpr, // Initial pixel-ratio, number
        dpr, // Current pixel-ratio, number
        factor, // Size.width / Viewport.width, number
        distance, // Distance from camera, number
        aspect, // Size.width / Size.height, number
        getCurrentViewport, // (camera?: Camera, target?: THREE.Vector3, size?: Size) => Viewport
      },
      set, // Allows you to set any state property, SetState<RootState>
      get, // Allows you to retrieve any state property non-rteactively, GetState<RootState>
      invalidate, // Request a new render, given that frameloop === 'demand', () => void
      advance, // Advance one tick, given that frameloop === 'never', (timestamp: number, runGlobalEffects?: boolean) => void
      setSize, // Resize the canvs, (width: number, height: number) => void
      setDpr, // Reset the pixel-ratio, (dpr: Dpr) => void
      onPointerMissed, // (event: ThreeEvent<PointerEvent>) => void
      events: {
        connected, // Event-target (for instance a dom node), TTarget | boolean
        handlers, // Pointer-event handlers (pointermove, up, down, etc), Events
        connect, // Re-connect to a new target, (target: TTarget) => void
        disconnect, // Dis-connect handlers, () => void
      },
      */
    }

    type Node = Element

    type SceneOptions = {
        antialias: boolean,
        background: string | number | THREE.Color
        cameraPosition: [number, number, number] | THREE.Vector3
    }

    type VNodeProps = (vueVNodeProps & {
        [key: string]: any;
    })
}