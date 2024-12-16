import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';

const pinia = createPinia()
createApp(App)
    .use(PrimeVue, {
        theme: 'none'
    })
    .use(ToastService)
    .use(pinia)
    .directive('tooltip', Tooltip)
    .mount('#app')
