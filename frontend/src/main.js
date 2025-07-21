import './styles/tailwind.css'

import { createApp } from 'vue'
import router from './router.js'
import MainLayout from './layouts/MainLayout.vue'

createApp(MainLayout).use(router).mount('#app')
