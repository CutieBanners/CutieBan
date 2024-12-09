<script setup lang="ts">
import Project from "@/components/Project.vue";
import { inject, ref, watch } from "vue";
import { CrudService } from "@/services/CrudService.ts";
import { useRoute } from "vue-router";

const crudService: CrudService = inject('crudService')!;
const route = useRoute();

// Reactive reference for project
const project = ref(null);

// Function to load the project
const loadProject = (id: number) => {
  project.value = crudService.getProject(id);
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