<script setup lang="ts">
import {PostItListModel} from "../models/PostItListModel.ts";
import {computed} from "vue";
import PostIt from "./PostIt.vue";

const { model } = defineProps<{ model: PostItListModel }>();

const sortedPostIts = computed(() => {
  return [...model.postIts].sort((a, b) => a.order - b.order);
});
</script>

<template>
  <div class="column">
    <h1>{{ model.title }}</h1>
    <div class="cards">
      <PostIt v-for="postIt in sortedPostIts" :model="postIt"></PostIt>
    </div>
  </div>
</template>

<style scoped>

</style>
