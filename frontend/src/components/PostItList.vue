<script setup lang="ts">
import { PostItListModel } from "../models/PostItListModel.ts";
import { ref, watch } from "vue";
import PostIt from "./PostIt.vue";
import Draggable from "vuedraggable";
import EditableInput from "./EditableInput.vue";

const { model } = defineProps<{ model: PostItListModel }>();
const postItRef = ref(model.postIts);

// Watch for changes to `postItRef` and sync them back to `model.postIts`
watch(postItRef, (newItems) => {
  model.postIts = [...newItems];
  console.log("model.postIts", model.postIts);
}, { deep: true });

const addPostIt = () => {
  postItRef.value.push({
    id: postItRef.value.length,
    title: "New Post-It",
    order: postItRef.value.length + 1,
    description: "Description",
    color: "yellow",
    date: new Date(),
    assignees: ["Alice", "Bob"],
    tags: ["tag1", "tag2"],
  });
};

const handleTitleEditFinished = () => {
  console.log("Title editing finished. New title:", model.title);
  // Add logic to send the updated title to the backend if needed
};
</script>

<template>
  <div class="column">
    <!-- Use EditableInput and listen for finishEditing -->
    <EditableInput v-model="model.title" @finishEditing="handleTitleEditFinished" />

    <draggable v-model="postItRef" item-key="id" group="postItList">
      <template #item="{ element }">
        <PostIt :model="element"></PostIt>
      </template>
      <template #footer>
        <button @click="addPostIt">Add</button>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.column {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  width: 250px;
  border-radius: 5px;
}
</style>
