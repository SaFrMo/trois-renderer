import { createApp } from '../../src/renderer'
import App from './Router.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const app = createApp(App)
app.extend({ OrbitControls })

// build router
// ====================
import { createRouter, createWebHistory } from 'vue-router'
import Blank from './paths/Blank.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/router/', component: Blank },
    ],
})
app.use(router)

// mount app
// ====================
app.mount('#app')
