import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Importa o CSS base do FontAwesome (opcional, mas pode deixar)
import '@fortawesome/fontawesome-free/css/all.min.css'

// 🟢 Importa e configura o FontAwesome para uso com Vue
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

// Adiciona o ícone de lápis à biblioteca
library.add(faPen)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 🟢 Registra o componente globalmente
app.component('FontAwesomeIcon', FontAwesomeIcon)

import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
