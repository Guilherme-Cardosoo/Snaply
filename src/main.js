import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
