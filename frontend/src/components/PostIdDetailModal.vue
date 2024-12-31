<script setup lang="ts">
import {defineProps, defineEmits, inject} from "vue";
import { PostItModel } from "../models/PostItModel";
import EditableInput from "./EditableInput.vue";
import {CrudService} from "../services/CrudService.ts";
import Editor from 'primevue/editor';


// Props to accept a PostItModel instance
const { selectedCard } = defineProps<{ selectedCard: { card: PostItModel, projectId: number, columnId: number } }>();
const crudService : CrudService = inject('crudService')!;
const postIt = selectedCard.card;

const emit = defineEmits<{
  (e: "close"): void;
}>();

// Update the PostItModel's title and description
const updateTitle = (newTitle: string) => {
  selectedCard.card.title = newTitle;
};

const updateDescription = (newDescription: string) => {
  selectedCard.card.description = newDescription;
};

const closeModal = () => {
  emit("close");
}

const removeCard = () => {
  crudService.deletePostItFromColumn(selectedCard.projectId, selectedCard.columnId, selectedCard.card);
  closeModal();
}
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="w-10 p-3 post-it" @click.stop>

      <!-- Editable Title -->
      <div class="flex align-items-center h-3rem w-full">
        <i class="pi pi-pen-to-square"></i>
        <EditableInput
            v-model="postIt.title"
            @update:modelValue="updateTitle"
            class="w-full cursor-pointer"
        />
        <i class="pi pi-times cursor-pointer" @click="closeModal"></i>
      </div>

      <!-- Editable Description -->
      <h2>Description</h2>
      <Editor
          editorStyle="height: 320px"
          v-model="postIt.description"
          @update:modelValue="updateDescription"
          class="editor_text_sizing"
      />

      <ul>
        <li><strong>Assignees:</strong> {{ postIt.assignees.join(', ') }}</li>
        <li><strong>Tags:</strong> {{ postIt.tags.join(', ') }}</li>
        <li><strong>Due Date:</strong> {{ postIt.endDate.toLocaleDateString() }}</li>
      </ul>

      <div class="modal-buttons">
        <button @click="removeCard">Remove Card</button> <!-- Remove Card Button -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}


.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.p-editor * {
  font-size: 1rem;
}
</style>
