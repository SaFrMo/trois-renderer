import { createApp, extend } from './renderer'
import App from './examples/TorusWalk.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    CubeCamera,
    // CubeRefractionMapping,
    // LinearMipmapLinearFilter,
    // RGBFormat,
    WebGLRenderTarget,
    WebGLCubeRenderTarget,
} from 'three'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

const app = createApp(App)

extend({
    app,
    OrbitControls,
    CubeCamera,
    WebGLRenderTarget,
    WebGLCubeRenderTarget,
    FullScreenQuad,
})


app.mount('#app')
