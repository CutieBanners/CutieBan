<script setup lang="ts">
import Project from "@/components/Project.vue";
import {inject, onMounted, onUpdated, reactive, ref, watch} from "vue";
import { useRoute } from "vue-router";
import {RecentProjectsService} from "@/services/RecentProjectsService";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";
import {ProjectModel} from "@/models/ProjectModel";
import NotFound from "@/components/NotFound.vue";
import anime from "animejs/lib/anime.es";

const recentProjects: RecentProjectsService = inject('recentProjectsService')!;
const projectService: ReactiveProjectService = inject('reactiveProjectService')!;
const route = useRoute();

// Reactive reference for project
const fetching = ref(true);
const hasProject = ref(false);
const projectKey = ref(0);

// Function to load the project
const loadProject = async (id: string) => {
  try {
    await projectService.fetchProject(id);
    const project = projectService.currentProject;
    fetching.value = false;
    if (project) {
      hasProject.value = true;
      recentProjects.addRecentProject(project);
    }
    projectKey.value++;
  } catch (e) {
    hasProject.value = false;
    console.error(e);
  }
};

watch(
    () => route.params.id,
    (newId, _) => {
      loadProject(newId.toString());
    },
    { immediate: true }
);

onUpdated(() => {
  // Set the initial state
  document.querySelectorAll('.post-it').forEach((el) => {
    el.style.transform = 'translateX(-300px)';
  });

  // Animate to the final position
  anime({
    targets: '.post-it',
    translateX: 0, // Move to the final position
    delay: anime.stagger(30), // Increase delay by 100ms for each element
    duration: 400, // Duration of the animation
    easing: 'easeOutQuad' // Smooth easing
  });
});
</script>

<template>
  <div v-if="!fetching">
    <Project v-if="hasProject" :key="projectKey"></Project>
    <NotFound v-else></NotFound>
  </div>
  <div v-else>
    <div class="flex justify-content-center align-items-center height_90">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>