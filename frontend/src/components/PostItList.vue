<script setup lang="ts">
import { PostItListModel } from "../models/PostItListModel.ts";
import { ref, watch } from "vue";
import PostIt from "./PostIt.vue";
import Draggable from "vuedraggable";
import EditableInput from "./EditableInput.vue";
import {PostItModel} from "../models/PostItModel.ts";

const { model } = defineProps<{
  model: PostItListModel,
  projectId : number
}>();

const emit = defineEmits<{
  (e: "removeColumn", columnId: number): void;
  (e: "cardClick", card: PostItModel, projectId: number, columnId: number): void;
}>();

const postItRef = ref(model.postIts);

// Watch for changes to `postItRef` and sync them back to `model.postIts`
watch(postItRef, (newItems) => {
  model.postIts = [...newItems];
}, { deep: true });

const addPostIt = () => {
  postItRef.value.push({
    id: Date.now(), // Unique ID
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
};
</script>

<template>
  <div class="column w-3 h-fit p-2 bg-auto border-round-sm border-2 surface-border border-primary bg-white">
    <!-- Editable title -->
    <EditableInput v-model="model.title" @finishEditing="handleTitleEditFinished" />

    <!-- Button to remove the column -->
    <button @click="$emit('removeColumn', model.id)" class="remove-button">Remove Column</button>

    <!-- Draggable post-it container -->
    <draggable v-model="postItRef" item-key="id" group="postItList">
      <template #item="{ element }">
        <PostIt :model="element" :project-id="projectId" :column-id="model.id" @cardClick="$emit('cardClick', element, projectId, model.id)" />
      </template>
      <template #footer>
        <button @click="addPostIt">Add</button>
      </template>
    </draggable>
  </div>
</template>

<style scoped>

.remove-button {
  background-color: #ff4d4f;
  color: white;
}

.remove-button:hover {
  background-color: #d9363e;
}
</style>
