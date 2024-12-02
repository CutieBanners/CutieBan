<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { PostItModel } from "../models/PostItModel";
import EditableInput from "./EditableInput.vue"; // Import the EditableInput component

// Props to accept a PostItModel instance
const { postIt } = defineProps<{ postIt: PostItModel }>();

// Emit event to close the modal
const emit = defineEmits<{
  (e: "close"): void;
}>();

// Update the PostItModel's title and description
const updateTitle = (newTitle: string) => {
  postIt.title = newTitle;
};

const updateDescription = (newDescription: string) => {
  postIt.description = newDescription;
};

const closeModal = () => {
  emit("close");
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
      <button @click="closeModal">Close</button>
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

button {
  margin-top: 10px;
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
