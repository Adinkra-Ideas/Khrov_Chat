import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import layer from '@layui/layer-vue'
import '@layui/layer-vue/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(layer)
app.mount('#app')
