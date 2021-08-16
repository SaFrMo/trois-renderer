import { createApp, extend } from '../../src/renderer'
import App from './TextChase.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const app = createApp(App)

extend({
    app,
    OrbitControls,
})


app.mount('#app')
