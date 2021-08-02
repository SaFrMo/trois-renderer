import { createApp } from '../../src/renderer'
import App from './Calendar.vue'
import { WebGLRenderer } from 'three'

const app = createApp(App)

app.extend({
    WebGLRenderer,
})


app.mount('#app')
