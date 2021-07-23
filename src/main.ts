import { createApp, extend } from './renderer'
import App from './examples/Demo4.vue'
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
