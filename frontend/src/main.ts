import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {CrudService} from "./services/CrudService.ts";

const app = createApp(App);
app.provide('crudService', new CrudService());
app.mount("#app");