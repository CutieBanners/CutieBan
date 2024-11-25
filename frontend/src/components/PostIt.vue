<script setup lang="ts">
import { defineProps } from 'vue'
import { PostItModel } from '../models/PostItModel.ts'
defineProps<{ model: PostItModel }>()
</script>

<template>
  <div class="post-it">
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
  cursor: grab;
}
</style>
