<script setup lang="ts">
import { ProjectModel } from "../models/ProjectModel.ts";
import CardList from "./PostItList.vue";
import Draggable from "vuedraggable";
import { ref } from "vue";

const { model } = defineProps<{ model: ProjectModel }>();
const postItListRef = ref(model.postItList);

const showModal = ref(false);
const selectedCard = ref(null);

const addColumn = () => {
  postItListRef.value.push({
    id: Date.now(),
    title: "New Column",
    postIts: [],
  });
};

// Method to remove a column by its ID
const removeColumn = (columnId: number) => {
  postItListRef.value = postItListRef.value.filter((column) => column.id !== columnId);
};

const handleCardClick = (card: any) => {
  selectedCard.value = card;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="project">
    <h1>{{ model.title }}</h1>

    <!-- Draggable columns container -->
    <draggable v-model="postItListRef" item-key="id" group="project" class="columns">
      <!-- Draggable item template for each column -->
      <template #item="{ element }">
        <CardList :model="element" @removeColumn="removeColumn" @cardClick="handleCardClick" />
      </template>

      <!-- Footer to add new columns -->
      <template #footer>
        <button @click="addColumn">Add Column</button>
      </template>
    </draggable>

    <!-- Popup Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ selectedCard?.title }}</h2>
        <p>{{ selectedCard?.description }}</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

button {
  padding: 10px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
