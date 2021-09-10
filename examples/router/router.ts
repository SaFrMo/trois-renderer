import { createApp } from '../../src/renderer'
import App from './Router.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const app = createApp(App)
app.extend({ OrbitControls })

// build router
// ====================
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Blank from './paths/Blank.vue'
import Solid from './paths/Solid.vue'
import Wireframe from './paths/Wireframe.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/router/', component: Blank },
        { path: '/router/shape/:geometry', component: Solid },
        { path: '/router/wireframe/:geometry', component: Wireframe },
    ],
})
app.use(router)

// mount app
// ====================
app.mount('#app')
