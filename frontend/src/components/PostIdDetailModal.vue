<script setup lang="ts">
import {defineProps, defineEmits, inject} from "vue";
import { PostItModel } from "../models/PostItModel";
import EditableInput from "./EditableInput.vue";
import {CrudService} from "../services/CrudService.ts"; // Import the EditableInput component

// Props to accept a PostItModel instance
const { selectedCard } = defineProps<{ selectedCard: { card: PostItModel, projectId: string, columnId: number } }>();
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
    <div class="modal" @click.stop>
      <h2>Edit Post-It</h2>

      <!-- Editable Title -->
      <EditableInput
          v-model="postIt.title"
          @update:modelValue="updateTitle"
          class="editable-input"
      />

      <!-- Editable Description -->
      <EditableInput
          v-model="postIt.description"
          @update:modelValue="updateDescription"
          class="editable-input"
      />

      <ul>
        <li><strong>Assignees:</strong> {{ postIt.assignees.join(', ') }}</li>
        <li><strong>Tags:</strong> {{ postIt.tags.join(', ') }}</li>
        <li><strong>Due Date:</strong> {{ postIt.endDate.toLocaleDateString() }}</li>
      </ul>

      <div class="modal-buttons">
        <button @click="closeModal">Close</button>
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

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
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
</style>
