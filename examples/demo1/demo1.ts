import { createApp, extend, } from '../../src/renderer'
import App from './Demo1.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    CubeCamera,
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
