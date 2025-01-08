<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { PostItModel } from "../models/PostItModel.ts";

const { model, columnId } = defineProps<{
  model: PostItModel
  columnId : number
}>();

const emit = defineEmits<{
  (e: "cardClick", cardId: number, columnId: number): void;
}>();

const handleClick = () => {
  emit("cardClick", model.id, columnId);
};
</script>

<template>
  <div class="post-it" @click="handleClick">
    <h2>{{ model.title }}</h2>
    <p>{{ model.description }}</p>
  </div>
</template>

<style scoped>
.post-it {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}
</style>
