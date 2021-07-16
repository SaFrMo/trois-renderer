import { createApp, extend } from './renderer'
import App from './examples/MVP.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    CubeCamera,
    // CubeRefractionMapping,
    // LinearMipmapLinearFilter,
    // RGBFormat,
    WebGLCubeRenderTarget,
} from 'three'

const app = createApp(App)

extend({ app, OrbitControls, CubeCamera, WebGLCubeRenderTarget })


app.mount('#app')
