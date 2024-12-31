<script setup lang="ts">
import { ref, defineProps, defineEmits, nextTick, computed } from "vue";
import { FloatLabel, InputText } from "primevue";

// Props
const props = defineProps<{
  modelValue: string; // The bound value for the editable text
}>();

// Events
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "finishEditing"): void;
}>();

// Local state for edit mode
const isEditing = ref(false);
let inputRef;

// Computed property to handle `v-model` binding
const editableValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const startEditing = async () => {
  isEditing.value = true;
  await nextTick(); // Ensure DOM updates
  inputRef = document.getElementById("in_label")
  inputRef.focus(); // Focus on the input field
};

const finishEditing = () => {
  isEditing.value = false;
  emit("finishEditing"); // Emit the finishEditing event
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    finishEditing();
  }
};
</script>

<template>
  <div>
    <!-- Display Mode -->
    <div v-if="!isEditing" @click="startEditing" class="editable-text">
      {{ editableValue }}
    </div>

    <!-- Edit Mode -->
    <FloatLabel v-else class="ml-2 text-overflow-clip">
      <InputText
          id="in_label"
          autocomplete="off"
          ref="inputRef"
          v-model="editableValue"
          @blur="finishEditing"
          @keydown="handleKeydown"
          class="editable-input"
          :autofocus="isEditing"
      />
    </FloatLabel>

  </div>
</template>

<style scoped>
.editable-text {
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
}

.editable-input {
  width: 100%;
  padding: 5px;
  font-size: 1.5rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
