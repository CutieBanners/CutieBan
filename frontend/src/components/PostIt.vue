<script setup lang="ts">
import { defineProps } from 'vue'
import { PostItModel } from '../models/PostItModel.ts'
defineProps<{ model: PostItModel }>()
</script>

<template>
  <div class="card">
    <h2>{{ model.title }}</h2>
    <p>{{ model.description }}</p>
  </div>
</template>

<style scoped>

</style>
