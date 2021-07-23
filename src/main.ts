import { createApp, extend, useTrois } from './renderer'
import App from './examples/Demo4.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    CubeCamera,
    WebGLRenderTarget,
    WebGLCubeRenderTarget,
} from 'three'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'
import { usePostprocessing } from './extras/postprocessing'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

const app = createApp(App)

extend({
    app,
    OrbitControls,
    CubeCamera,
    WebGLRenderTarget,
    WebGLCubeRenderTarget,
    FullScreenQuad,
    //     UnrealBloomPass,
})

usePostprocessing({ app, extend, trois: useTrois() })

app.mount('#app')
