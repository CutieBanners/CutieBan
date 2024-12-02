<script setup lang="ts">
import { ProjectModel } from "../models/ProjectModel.ts";
import CardList from "./PostItList.vue";
import Draggable from "vuedraggable";
import { ref } from "vue";

const { model } = defineProps<{ model: ProjectModel }>();
const postItListRef = ref(model.postItList);

// Method to add a new column
const addColumn = () => {
  postItListRef.value.push({
    id: Date.now(), // Use a timestamp to ensure unique column ID
    title: "New Column",
    postIts: [], // Empty list of post-its for the new column
  });
};

// Method to remove a column by its ID
const removeColumn = (columnId: number) => {
  postItListRef.value = postItListRef.value.filter((column) => column.id !== columnId);
};
</script>

<template>
  <div class="project">
    <h1>{{ model.title }}</h1>

    <!-- Draggable columns container -->
    <draggable v-model="postItListRef" item-key="id" group="project" class="columns">
      <!-- Draggable item template for each column -->
      <template #item="{ element }">
        <CardList :model="element" @removeColumn="removeColumn" />
      </template>

      <!-- Footer to add new columns -->
      <template #footer>
        <button @click="addColumn">Add Column</button>
      </template>
    </draggable>
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
