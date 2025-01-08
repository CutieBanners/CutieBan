<script setup lang="ts">
import {defineProps, defineEmits, inject, computed} from "vue";
import EditableInput from "./EditableInput.vue";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";

// Props to accept a PostItModel instance
const { selectedCard } = defineProps<{ selectedCard: { cardId: number, columnId: number } }>();
const projectService: ReactiveProjectService = inject('reactiveProjectService')!;
const postIt = computed(() => projectService.currentProject.postItList.find(column => column.id === selectedCard.columnId)!.postIts.find(postIt => postIt.id === selectedCard.cardId)!);

const emit = defineEmits<{
  (e: "close"): void;
}>();

// Update the PostItModel's title and description
const updateTitle = (newTitle: string) => {
  postIt.value.title = newTitle;
};

const updateDescription = (newDescription: string) => {
  postIt.value.description = newDescription;
};

const closeModal = () => {
  emit("close");
}

const removeCard = () => {
  projectService.deletePostIt(selectedCard.columnId, selectedCard.cardId);
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
        <li><strong>Due Date:</strong> {{  postIt.endDate?.toLocaleDateString() ?? "No due date" }}</li>
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
