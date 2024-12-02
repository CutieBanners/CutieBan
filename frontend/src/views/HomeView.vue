<script setup lang="ts">

import {ProjectModel} from "../models/ProjectModel.ts";
import {PostItModel} from "../models/PostItModel.ts";
import CardList from "../components/PostItList.vue";

const project : ProjectModel = {
  title: "Project Title",
  postItList: [
    {
      id: 0,
      title: "Column 1",
      order: 1,
      postIts: [
        new PostItModel(0, "Card 1", 1,"Description 1", "red", new Date(), ["Alice", "Bob"], ["tag1", "tag2"]),
        new PostItModel(1, "Card 2", 2,"Description 2", "blue", new Date(), ["Alice", "Charlie"], ["tag2", "tag3"]),
      ]
    },
    {
      id: 1,
      title: "Column 2",
      order: 2,
      postIts: [
        new PostItModel(2, "Card 3", 1,"Description 3", "green", new Date(), ["Bob", "Charlie"], ["tag1", "tag3"]),
        new PostItModel(3, "Card 4", 2,"Description 4", "yellow", new Date(), ["Alice", "Charlie"], ["tag1", "tag2"]),
      ]
    }
  ]
}
</script>

<template>
  <div class="project">
    <h1>{{ project.title }}</h1>
    <div class="columns">
      <CardList v-for="column in project.postItList" :model="column"></CardList>
    </div>
  </div>
</template>

<style scoped>

</style>