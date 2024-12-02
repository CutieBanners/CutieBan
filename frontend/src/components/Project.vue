<script setup lang="ts">
import { ProjectModel } from "../models/ProjectModel.ts";
import CardList from "./PostItList.vue";
import Draggable from "vuedraggable";
import Modal from "./PostIdDetailModal.vue";
import { ref } from "vue";
import { PostItModel } from "../models/PostItModel.ts"; // Import the PostItModel

const { model } = defineProps<{ model: ProjectModel }>();
const postItListRef = ref(model.postItList);

const selectedCard = ref<PostItModel | null>(null);

const addColumn = () => {
  postItListRef.value.push({
    id: Date.now(),
    title: "New Column",
    postIts: [],
  });
};

const removeColumn = (columnId: number) => {
  postItListRef.value = postItListRef.value.filter((column) => column.id !== columnId);
};

const handleCardClick = (card: PostItModel) => {
  selectedCard.value = card; // Store the clicked card's PostItModel
};

const closeModal = () => {
  selectedCard.value = null; // Reset the selected card
};
</script>

<template>
  <div class="project">
    <h1>{{ model.title }}</h1>

    <draggable v-model="postItListRef" item-key="id" group="project" class="columns">
      <template #item="{ element }">
        <CardList :model="element" @removeColumn="removeColumn" @cardClick="handleCardClick" />
      </template>
      <template #footer>
        <button @click="addColumn">Add Column</button>
      </template>
    </draggable>

    <!-- Modal Component -->
    <Modal
        v-if="selectedCard"
        :postIt="selectedCard"
        @close="closeModal"
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
