import { RendererNode, VNodeProps } from '@vue/runtime-core'
import * as THREE from 'three'

// WIP: r3f-style type setup
export type LocalState = {
  // root: UseStore<RootState>
  objects: Instance[]
  instance?: boolean
  // handlers?: EventHandlers
  // memoizedProps: {
  //   [key: string]: any
  // }}
}

// From r3f:
// This type clamps down on a couple of assumptions that we can make regarding native types, which
// could anything from scene objects, THREE.Objects, JSM, user-defined classes and non-scene objects.
// What they all need to have in common is defined here ...
export type BaseInstance = Omit<THREE.Object3D, 'parent' | 'children' | 'attach' | 'add' | 'remove' | 'raycast'> & {
  __trois: LocalState
  parent: Instance | null
  children: Instance[]
  // attach?: string
  // remove: (...object: Instance[]) => Instance
  // add: (...object: Instance[]) => Instance
  // raycast?: (raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) => void
}
export type Instance = BaseInstance & { [key: string]: any }

export type SceneOptions = {
  background: string | number | THREE.Color
  cameraPosition: [number, number, number] | THREE.Vector3
}

// based on r3f useThree: https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#usethree
export type TroisInternals = {
  initialized: boolean,
  renderer: THREE.WebGLRenderer | null,
  scene: THREE.Scene | null,
  camera: THREE.Camera | null,
  size: {
    width: number,
    height: number,
  },

  // not yet implemented (copied from r3f):
  /*
    raycaster, // Raycaster
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


export type TroisNode = RendererNode & {
  vnodeProps?: TroisProps
}
export type TroisProps = (VNodeProps & {
  [key: string]: any;
} | null | undefined) & {
  target?: THREE.Object3D | null
}