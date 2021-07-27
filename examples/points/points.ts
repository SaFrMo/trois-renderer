import { createApp, extend } from '../../src/renderer'
import App from './Points.vue'
import { WebGLRenderer } from 'three'

const app = createApp(App)

extend({
    app,
    WebGLRenderer,
})


app.mount('#app')
