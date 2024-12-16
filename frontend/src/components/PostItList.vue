<script setup lang="ts">
import { PostItListModel } from "../models/PostItListModel.ts";
import { ref, watch } from "vue";
import PostIt from "./PostIt.vue";
import Draggable from "vuedraggable";
import EditableInput from "./EditableInput.vue";
import {PostItModel} from "../models/PostItModel.ts";

const { model } = defineProps<{
  model: PostItListModel,
  projectId : number
}>();

const emit = defineEmits<{
  (e: "removeColumn", columnId: number): void;
  (e: "cardClick", card: PostItModel, projectId: number, columnId: number): void;
}>();

const postItRef = ref(model.postIts);

// Watch for changes to `postItRef` and sync them back to `model.postIts`
watch(postItRef, (newItems) => {
  model.postIts = [...newItems];
}, { deep: true });

const addPostIt = () => {
  postItRef.value.push({
    id: Date.now(), // Unique ID
    title: "New Post-It",
    order: postItRef.value.length + 1,
    description: "Description",
    color: "yellow",
    date: new Date(),
    assignees: ["Alice", "Bob"],
    tags: ["tag1", "tag2"],
  });
};

const handleTitleEditFinished = () => {
  console.log("Title editing finished. New title:", model.title);
};

const dragOptions = ref({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
});

const drag = ref(false);

</script>

<template>
  <div class="">
    <div class="flex align-items-center justify-content-between cursor-pointer h-3rem">
      <i class="pi pi-arrows-h"></i>
      <!-- Editable title -->
      <EditableInput v-model="model.title" @finishEditing="handleTitleEditFinished" />
      <!-- Button to remove the column -->
      <i class="pi pi-trash remove-button" @click="$emit('removeColumn', model.id)"></i>
    </div>

    <!-- Draggable post-it container -->
    <transition-group>
      <draggable v-model="postItRef" item-key="id" group="postItList" class="h-full" v-bind="dragOptions" @start="drag = true"
                 @end="drag = false">
        <template #item="{ element }">
          <PostIt :model="element" :project-id="projectId" :column-id="model.id" @cardClick="$emit('cardClick', element, projectId, model.id)" />
        </template>
        <template #footer>
          <div class="post-it h-3rem opacity-50 text-center" @click="addPostIt">+</div>
        </template>
      </draggable>
    </transition-group>
  </div>
</template>

<style scoped>
.remove-button {
  color: #ff4d4f;
}

.remove-button:hover {
  color: #d9363e;
}
</style>
