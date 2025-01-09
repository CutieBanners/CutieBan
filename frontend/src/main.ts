import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import router from '@/router'
import {RecentProjectsService} from "@/services/RecentProjectsService";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'diabled',
            cssLayer: false
        }
    }
});

app.use(router)
app.provide('recentProjectsService', new RecentProjectsService());
app.provide('reactiveProjectService', new ReactiveProjectService());
app.mount("#app");