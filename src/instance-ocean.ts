import { createApp, extend, useTrois } from './renderer'
import App from './examples/InstanceOcean.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    //     CubeCamera,
    WebGLRenderer,
    //     WebGLCubeRenderTarget,
} from 'three'
// import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'
// import { usePostprocessing } from './extras/postprocessing'
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

const app = createApp(App)

extend({
    app,
    OrbitControls,
    // CubeCamera,
    WebGLRenderer,
    // WebGLCubeRenderTarget,
    // FullScreenQuad,
    //     UnrealBloomPass,
})

// usePostprocessing({ app, extend, trois: useTrois() })

app.mount('#app')
