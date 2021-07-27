import { createApp, extend } from '../../src/renderer'
import App from './Table.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    WebGLRenderer,
} from 'three'

const app = createApp(App)

extend({
    app,
    OrbitControls,
    WebGLRenderer,
})

app.mount('#app')
