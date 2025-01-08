<script setup lang="ts">
import Project from "@/components/Project.vue";
import { inject, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {RecentProjectsService} from "@/services/RecentProjectsService";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";
import {ProjectModel} from "@/models/ProjectModel";
import NotFound from "@/components/NotFound.vue";

const recentProjects: RecentProjectsService = inject('recentProjectsService')!;
const projectService: ReactiveProjectService = inject('reactiveProjectService')!;
const route = useRoute();

// Reactive reference for project
const hasProject = ref(false);

// Function to load the project
const loadProject = async (id: string) => {
  try {
    await projectService.fetchProject(id);
    const project = projectService.currentProject;
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
  <Project v-if="hasProject"></Project>
  <NotFound v-else></NotFound>
</template>

<style scoped>
</style>