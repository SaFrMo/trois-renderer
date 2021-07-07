import { createApp, extend } from './renderer'
import App from './examples/Demo4.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const app = createApp(App)

// extend({ app, OrbitControls })


app.mount('#app')
