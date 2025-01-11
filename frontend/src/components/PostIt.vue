<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import { PostItModel } from "@/models/PostItModel";

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

const textColor = computed(() => {
  const color = model.color.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#2c3e50' : 'white';
});
</script>

<template>
  <div class="post-it max-h-10rem max overflow-y-hidden column-width" @click="handleClick" @touchend="handleClick" @dragstart="handleDrag" :style="{ backgroundColor: model.color}">
    <h2 class="overflow-hidden white-space-nowrap text-overflow-ellipsis" :style="{ color: textColor }">{{model.title}}</h2>
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
