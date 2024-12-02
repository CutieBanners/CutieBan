<script setup lang="ts">
import { PostItListModel } from "../models/PostItListModel.ts";
import {computed, ref, watch} from "vue";
import PostIt from "./PostIt.vue";
import Draggable from "vuedraggable";

const { model } = defineProps<{ model: PostItListModel }>();

const postItRef = ref(model.postIts);

// Watch for changes to `items` and sync them back to `model.postIts`
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
</script>

<template>
  <div class="column">
    <h2>{{ model.title }}</h2>
    <draggable v-model="postItRef" item-key="id" group="postItList">
      <template #item="{element}">
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

.column h2 {
  text-align: center;
}

</style>
