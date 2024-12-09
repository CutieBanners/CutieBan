<script setup lang="ts">
import { ProjectModel } from "../models/ProjectModel.ts";
import CardList from "./PostItList.vue";
import Draggable from "vuedraggable";
import Modal from "./PostIdDetailModal.vue";
import { ref } from "vue";
import { PostItModel } from "../models/PostItModel.ts";
import Horizontal_rule from "@/components/HorizontalRule.vue"; // Import the PostItModel

const { model } = defineProps<{ model: ProjectModel }>();
const postItListRef = ref(model.postItList);

const selectedCard = ref<{ card: PostItModel, projectId: number, columnId: number } | null>(null);

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

const handleCardClick = (card: PostItModel, projectId: number, columnId: number) => {
  selectedCard.value = { card, projectId, columnId };
};

const closeModal = () => {
  selectedCard.value = null; // Reset the selected card
};

// Handle removing a card
const removeCard = (id: number) => {
  if (selectedCard.value) {
    model.postItList = model.postItList.filter((column) =>
        column.postIts.every(postIt => postIt.id !== id) // Remove the card with matching id
    );
    selectedCard.value = null; // Reset the selected card
  }
};
</script>

<template>
  <div class="project">
    <h1 class="chewy-regular text-6xl m-0">{{ model.title }}
    <Horizontal_rule></Horizontal_rule>
    </h1>

    <draggable v-model="postItListRef" item-key="id" group="project" class="columns w-full">
      <template #item="{ element }">
        <CardList :model="element" :project-id="model.id" @removeColumn="removeColumn" @cardClick="handleCardClick" />
      </template>
      <template #footer>
        <button @click="addColumn" class="w-3 h-fit p-2 border-round-sm">Add Column</button>
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
  align-items: center;
}

.columns {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding: 10px;
  overflow-x: auto;
}
</style>
