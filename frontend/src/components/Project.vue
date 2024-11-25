<script setup lang="ts">
import { ProjectModel } from "../models/ProjectModel.ts";
import CardList from "./PostItList.vue";
import Draggable from "vuedraggable";
import { ref } from "vue";

// Define props and reactive reference to postItList
const { model } = defineProps<{ model: ProjectModel }>();
const postItListRef = ref(model.postItList);

// Method to add a new column (you can modify this as per your requirement)
const addColumn = () => {
  postItListRef.value.push({
    id: postItListRef.value.length + 1, // Ensure unique column ID
    title: "New Column",
    postIts: [] // Empty list of post-its for the new column
  });
};
</script>

<template>
  <div class="project">
    <h1>{{ model.title }}</h1>

    <!-- Draggable columns container -->
    <draggable v-model="postItListRef" item-key="id" group="project" class="columns">

      <!-- Draggable item template for each column -->
      <template #item="{ element }">
        <div class="column">
          <h2>{{ element.title }}</h2>
          <CardList :model="element" />
        </div>
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

.column {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  width: 250px;
  border-radius: 5px;
}

.column h2 {
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
