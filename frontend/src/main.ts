import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';
import router from '@/router'
import {RecentProjectsService} from "@/services/RecentProjectsService";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";
import {ProjectsService} from "@/services/ProjectsService";

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(router)
app.provide('recentProjectsService', new RecentProjectsService());
app.provide('reactiveProjectService', new ReactiveProjectService());
app.provide('projectsService', new ProjectsService());
app.mount("#app");