<script setup lang="ts">
import Project from "@/components/Project.vue";
import { inject, ref, watch } from "vue";
import { CrudService } from "@/services/CrudService.ts";
import { useRoute } from "vue-router";
import {RecentProjectsService} from "@/services/RecentProjectsService";

const crudService: CrudService = inject('crudService')!;
const recentProjects: RecentProjectsService = inject('recentProjectsService')!;
const route = useRoute();

// Reactive reference for project
const project = ref(null);

// Function to load the project
const loadProject = (id: string) => {
  project.value = crudService.getProject(id);
  if (project) {
    recentProjects.addRecentProject(project);
  }
};

watch(
    () => route.params.id,
    (newId, oldId) => {
      loadProject(Number(newId));
    },
    { immediate: true }
);
</script>

<template>
  <Project :model="project"></Project>
</template>

<style scoped>
</style>