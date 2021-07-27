import { createApp, extend, useTrois } from '../../src/renderer'
import App from './Demo4.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { usePostprocessing } from '../../src/extras/postprocessing'

const app = createApp(App)

extend({
    app,
    OrbitControls,
})

usePostprocessing({ app, extend, trois: useTrois() })

app.mount('#app')
