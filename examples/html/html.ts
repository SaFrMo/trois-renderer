import { createApp } from 'vue'
import { createApp as troisCreateApp } from '../../src/renderer'
import App from './App.vue'
import TroisApp from './TroisApp.vue'

// html app
const app = createApp(App)
app.mount('#app')

// trois app
const troisApp = troisCreateApp(TroisApp)
troisApp.mount('.wrapper')
