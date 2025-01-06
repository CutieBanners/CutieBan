<script setup lang="ts">
import Project from "@/components/Project.vue";
import { inject, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {RecentProjectsService} from "@/services/RecentProjectsService";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";
import {ProjectModel} from "@/models/ProjectModel";

const recentProjects: RecentProjectsService = inject('recentProjectsService')!;
const projectService: ReactiveProjectService = inject('reactiveProjectService')!;
const route = useRoute();

// Reactive reference for project
let project : ProjectModel | null = null;
const hasProject = ref(false);

// Function to load the project
const loadProject = async (id: string) => {
  try {
    await projectService.fetchProject(id);
    project = projectService.currentProject;
    if (project) {
      hasProject.value = true;
      recentProjects.addRecentProject(project);
    }
  } catch (e) {
    hasProject.value = false;
    console.error(e);
  }
};

watch(
    () => route.params.id,
    (newId, oldId) => {
      loadProject(newId);
    },
    { immediate: true }
);
</script>

<template>
  <Project :model="project" v-if="hasProject"></Project>
</template>

<style scoped>
</style>