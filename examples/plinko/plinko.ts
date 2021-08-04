import { createApp, extend } from '../../src/renderer'
import App from './Plinko.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { usePhysics } from '../../src/extras/physics'
import { useTrois } from '../../src/renderer'
const trois = useTrois()

const app = createApp(App)
usePhysics({ app, trois })

extend({
    app,
    OrbitControls,
})


app.mount('#app')
