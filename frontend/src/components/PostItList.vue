<script setup lang="ts">
import {computed, inject, ref, watch} from "vue";
import PostIt from "./PostIt.vue";
import Draggable from "vuedraggable";
import EditableInput from "./EditableInput.vue";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";

const projectService: ReactiveProjectService = inject('reactiveProjectService')!;

const { id } = defineProps<{
  id: number
}>();

const emit = defineEmits<{
  (e: "removeColumn", columnId: number): void;
  (e: "cardClick", cardId: number, columnId: number): void;
  (e: "addPostIt", columnId: number, order: number): void;
}>();

const model = computed(() => projectService.currentProject.postItList.find(column => column.id === id)!);

const handleTitleEditFinished = () => {
  console.log("Title editing finished. New title:", model.title);
};
</script>

<template>
  <div class="column">
    <!-- Editable title -->
    <EditableInput v-model="model.title" @finishEditing="handleTitleEditFinished" />

    <!-- Button to remove the column -->
    <button @click="$emit('removeColumn', id)" class="remove-button">Remove Column</button>

    <!-- Draggable post-it container -->
    <draggable v-model="model.postIts" item-key="id" group="postItList">
      <template #item="{ element }">
        <PostIt :model="element" :project-id="projectId" :column-id="id" @cardClick="(cardId, columnId) => $emit('cardClick', cardId, columnId)" />
      </template>
      <template #footer>
        <button @click="$emit('addPostIt', id, model.postIts.length + 1)">Add</button>
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

.remove-button {
  background-color: #ff4d4f;
  color: white;
}

.remove-button:hover {
  background-color: #d9363e;
}
</style>
