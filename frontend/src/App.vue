<script setup lang="ts">

import Project from "./components/Project.vue";
import {inject} from "vue";
import {CrudService} from "./services/CrudService.ts";

const crudService : CrudService = inject('crudService')!;
const project = crudService.getProject(0)!;
</script>

<template>
  <Project :model="project"></Project>
</template>

<style scoped>

</style>
