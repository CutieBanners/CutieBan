<script setup lang="ts">
import { ref, defineProps, defineEmits, nextTick, computed } from "vue";

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
const inputRef = ref<HTMLInputElement | null>(null);

// Computed property to handle `v-model` binding
const editableValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const startEditing = async () => {
  isEditing.value = true;
  await nextTick(); // Ensure DOM updates
  inputRef.value?.focus(); // Focus on the input field
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
    <input
        v-else
        ref="inputRef"
        v-model="editableValue"
        @blur="finishEditing"
        @keydown="handleKeydown"
        class="editable-input"
    />
  </div>
</template>

<style scoped>
.editable-text {
  font-size: 1.5rem;
  text-align: center;
  cursor: pointer;
}

.editable-input {
  width: calc(100% - 8px);
  padding: 5px;
  font-size: 1.5rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
