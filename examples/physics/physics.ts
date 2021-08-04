import { createApp, extend } from '../../src/renderer'
import App from './Physics.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { World as CannonWorld } from 'cannon-es'

const app = createApp(App)

extend({
    app,
    OrbitControls,
    CannonWorld,
})


app.mount('#app')
