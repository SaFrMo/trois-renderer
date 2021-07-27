import { createApp, extend, useTrois } from '../../src/renderer'
import App from './Demo4.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    CubeCamera,
    WebGLRenderTarget,
    WebGLCubeRenderTarget,
} from 'three'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'
import { usePostprocessing } from '../../src/extras/postprocessing'

const app = createApp(App)

extend({
    app,
    OrbitControls,
    CubeCamera,
    WebGLRenderTarget,
    WebGLCubeRenderTarget,
    FullScreenQuad,
})

usePostprocessing({ app, extend, trois: useTrois() })

app.mount('#app')
