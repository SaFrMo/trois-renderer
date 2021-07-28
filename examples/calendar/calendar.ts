import { createApp, extend } from '../../src/renderer'
import App from './Calendar.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'


const app = createApp(App)

extend({
    app,
    OrbitControls,
    OrbitControlsWrapper,
})


app.mount('#app')
