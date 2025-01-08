<script setup lang="ts">
import { ProjectModel } from "../models/ProjectModel.ts";
import CardList from "./PostItList.vue";
import Draggable from "vuedraggable";
import Modal from "./PostIdDetailModal.vue";
import {inject, ref} from "vue";
import { PostItModel } from "../models/PostItModel.ts";
import {ReactiveProjectService} from "@/services/ReactiveProjectService"; // Import the PostItModel

const projectService: ReactiveProjectService = inject('reactiveProjectService')!;

const selectedCard = ref<{ cardId: number, columnId: number } | null>(null);

const addColumn = () => {
  projectService.addColumn("New Column");
};

const removeColumn = (columnId: number) => {
  projectService.removeColumn(columnId);
};

const handleCardClick = (cardId: number, columnId: number) => {
  selectedCard.value = { cardId, columnId };
};

const addPostIt = (columnId: number, order: number) => {
  projectService.createPostIt(columnId,{
    id: Date.now(),
    title: "New Post-It",
    order: order,
    description: "Description",
    color: "yellow",
    date: new Date(),
    assignees: [],
    tags: [],
  });
};

const closeModal = () => {
  selectedCard.value = null; // Reset the selected card
};

const removeCard = (id: number) => {
  if (selectedCard.value) {
    projectService.deletePostIt(selectedCard.value.columnId, id);
    selectedCard.value = null; // Reset the selected card
  }
};
</script>

<template>
  <div class="project">
    <h1>{{ projectService.currentProject.title }}</h1>

    <draggable v-model="projectService.currentProject.postItList" item-key="id" group="project" class="columns">
      <template #item="{ element }">
        <CardList :id="element.id" @removeColumn="removeColumn" @cardClick="handleCardClick" @addPostIt="addPostIt" />
      </template>
      <template #footer>
        <button @click="addColumn">Add Column</button>
      </template>
    </draggable>

    <!-- Modal Component -->
    <Modal
        v-if="selectedCard"
        :selectedCard="selectedCard"
        @close="closeModal"
        @removeCard="removeCard"
    />
  </div>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.columns {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding: 10px;
  overflow-x: auto;
}
</style>
