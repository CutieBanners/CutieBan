import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/HomeView.vue';
import Project from "@/views/ProjectView.vue";

// Add routes here ! please !
const routes = [
    { path: '/', name: "home", component: Home },
    { path: '/project/:id', name: "project", component: Project },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
export default router