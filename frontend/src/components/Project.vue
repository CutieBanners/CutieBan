<script setup lang="ts">
import { ProjectModel } from "../models/ProjectModel.ts";
import CardList from "./PostItList.vue";
import Draggable from "vuedraggable";
import Modal from "./PostIdDetailModal.vue";
import { ref } from "vue";
import { PostItModel } from "../models/PostItModel.ts";
import Horizontal_rule from "@/components/HorizontalRule.vue";
import {Button} from "primevue";

const { model } = defineProps<{ model: ProjectModel }>();
const postItListRef = ref(model.postItList);

const selectedCard = ref<{ card: PostItModel, projectId: number, columnId: number } | null>(null);

const addColumn = () => {
  postItListRef.value.push({
    id: Date.now(),
    title: "New Column",
    postIts: [],
  });
};

const removeColumn = (columnId: number) => {
  postItListRef.value = postItListRef.value.filter((column) => column.id !== columnId);
};

const handleCardClick = (card: PostItModel, projectId: number, columnId: number) => {
  selectedCard.value = { card, projectId, columnId };
};

const closeModal = () => {
  selectedCard.value = null; // Reset the selected card
};

// Handle removing a card
const removeCard = (id: number) => {
  if (selectedCard.value) {
    model.postItList = model.postItList.filter((column) =>
        column.postIts.every(postIt => postIt.id !== id) // Remove the card with matching id
    );
    selectedCard.value = null; // Reset the selected card
  }
};
const dragOptions = ref({
  animation: 200,
  disabled: false,
  ghostClass: 'ghost',
});

const drag = ref(false);

</script>

<template>
  <div class="">
    <div class="flex justify-content-center">
      <h1 class="chewy-regular text-6xl m-0">{{ model.title }}
        <Horizontal_rule></Horizontal_rule>
      </h1>
    </div>

    <div class="">
      <transition-group>
        <draggable v-model="postItListRef" item-key="id" group="project" class="project h-85" v-bind="dragOptions" @start="drag = true"
                   @end="drag = false">
          <template #item="{ element }">
            <CardList :model="element" :project-id="model.id" @removeColumn="removeColumn" @cardClick="handleCardClick" class="w-250px vertical_line"/>
          </template>
          <template #footer>
            <Button @click="addColumn" class="h-fit p-2 w-250px border-2">Add Column</Button>
          </template>
        </draggable>
      </transition-group>
    </div>

    <!-- Modal Component -->
    <Modal
        v-if="selectedCard"
        :selectedCard="selectedCard"
        @close="closeModal"
        @removeCard="removeCard"
    />
  </div>
</template>

<style scoped>
.project {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: auto;
}

.w-250px {
  flex: 0 0 250px;
}

.h-85 {
  height: 85vh;
}

.vertical_line {
  border-right: 2px dashed;
  height: 90vh;
  margin-right: 10px;
  padding-right: 10px;
}

</style>
