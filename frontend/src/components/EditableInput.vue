<script setup lang="ts">
import { ref, defineProps, defineEmits, nextTick, computed } from "vue";
import { FloatLabel, InputText } from "primevue";
import anime from "animejs/lib/anime.es.js";

// Props
const props = defineProps<{
  modelValue: string; // The bound value for the editable text
  isTitle?: boolean;
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
  if (editableValue.value) {
    isEditing.value = false;
    emit("finishEditing"); // Emit the finishEditing event
  }
  else {

    document.getElementById("in_label").style.borderColor = "red";

    anime({
      targets: '#in_label',
      easing: 'linear',
      duration: 200,
      translateX: [
        {
          value: 10,
        },
        {
          value: -10,
        },
        {
          value: 0,
        },
      ],
    });
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    finishEditing();
  }
};
</script>

<template>
  <div class="root-editable">
    <!-- Display Mode -->
    <div v-if="!isEditing" @click="startEditing" @touchend="startEditing" class="editable-text text-overflow-ellipsis">
      <div v-if="!isTitle" class="text-2xl">
        {{ editableValue }}
      </div>
      <div v-else>
        <h1 class="chewy-regular xl:text-5xl text-3xl m-0 editable-text text-overflow-ellipsis underline">
          {{ editableValue }}
        </h1>
      </div>
    </div>

    <!-- Edit Mode -->
    <FloatLabel v-else class="ml-2 text-overflow-clip">
      <InputText
          v-if="isTitle"
          id="in_label"
          autocomplete="off"
          ref="inputRef"
          v-model="editableValue"
          @blur="finishEditing"
          @keydown="handleKeydown"
          class="editable-input text-3xl"
          :autofocus="isEditing"
      />
      <InputText
          v-else
          id="in_label"
          autocomplete="off"
          ref="inputRef"
          v-model="editableValue"
          @blur="finishEditing"
          @keydown="handleKeydown"
          class="editable-input text-2xl"
          :autofocus="isEditing"
      />
    </FloatLabel>

  </div>
</template>

<style scoped>

.editable-text {
  width: 100%;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
}

.editable-input {
  width: 100%;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
}

</style>
