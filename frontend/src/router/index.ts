import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

// Add routes here ! please !
const routes = [
    {path: '/', name: "Home", component: Home}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
export default router