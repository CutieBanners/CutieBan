<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { PostItModel } from "@/models/PostItModel.ts";

const { model } = defineProps<{
  model: PostItModel
}>();

const emit = defineEmits<{
  (e: "cardClick", cardId: number): void;
}>();

const handleClick = () => {
  emit("cardClick", model.id);
};

const handleDrag = (event) => {
  event.target.style.opacity = '0';
  setTimeout(() => {
    event.target.style.opacity = '1';
  }, 1);
};
</script>

<template>
  <div class="post-it max-h-10rem max overflow-y-hidden column-width" @click="handleClick"  @dragstart="handleDrag">
    <h2 class="overflow-hidden white-space-nowrap text-overflow-ellipsis">{{ model.title }}</h2>
    <div v-html="model.description" class="max-w-10rem overflow-hidden"></div>
  </div>
</template>

<style scoped>
.column-width {
  max-width: 250px;
}

h2{
  font-size: 1.2em;
}

.post-it{
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .column-width {
    max-width: 150px;
  }
}
</style>
