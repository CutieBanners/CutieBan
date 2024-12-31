<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { PostItModel } from "../models/PostItModel.ts";

const { model, projectId, columnId } = defineProps<{
  model: PostItModel,
  projectId : number,
  columnId : number
}>();

const emit = defineEmits<{
  (e: "cardClick", card: PostItModel, projectId: number, columnId: number): void;
}>();

const handleClick = () => {
  emit("cardClick", model, projectId, columnId);
};


const handleDrag = (event) => {
  // Rendre l'élément transparent
  event.target.style.opacity = '0';
  setTimeout(() => {
    event.target.style.opacity = '1';
  }, 1);
};
</script>

<template>
  <div class="post-it" @click="handleClick"  @dragstart="handleDrag">
    <h2>{{ model.title }}</h2>
    <div v-html="model.description"></div>
  </div>
</template>

<style scoped>

</style>
