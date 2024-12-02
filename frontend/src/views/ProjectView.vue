<script setup lang="ts">
import Project from "@/components/Project.vue";
import {inject} from "vue";
import {CrudService} from "@/services/CrudService.ts";
import {useRoute} from "vue-router";

const crudService : CrudService = inject('crudService')!;
const route = useRoute();
const projectId : number = Number(route.params.id);
const project = crudService.getProject(projectId);
console.log(project);
</script>

<template>
  <Project :model="project"></Project>
</template>

<style scoped>

</style>