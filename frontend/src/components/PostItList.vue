<script setup lang="ts">
import {computed, inject, onMounted, ref} from "vue";
import PostIt from "./PostIt.vue";
import Draggable from "vuedraggable";
import EditableInput from "./EditableInput.vue";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";
import anime from 'animejs/lib/anime.es.js';

const projectService: ReactiveProjectService = inject('reactiveProjectService')!;

const { id } = defineProps<{
  id: number
}>();

const emit = defineEmits<{
  (e: "removeColumn", columnId: number): void;
  (e: "cardClick", cardId: number, columnId: number): void;
  (e: "addPostIt", columnId: number): void;
}>();

const model = computed(() => projectService.currentProject.postItList.find(column => column.id === id)!);

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

onMounted(() => {
  // Set the initial state
  document.querySelectorAll('.post-it').forEach((el) => {
    el.style.transform = 'translateX(-300px)';
  });

  // Animate to the final position
  anime({
    targets: '.post-it',
    translateX: 0, // Move to the final position
    delay: anime.stagger(30), // Increase delay by 100ms for each element
    duration: 400, // Duration of the animation
    easing: 'easeOutQuad' // Smooth easing
  });
});
</script>

<template>
  <div class="">
    <div class="flex align-items-center justify-content-between cursor-pointer h-3rem">
      <i class="pi pi-arrows-h drag-handle"></i>
      <!-- Editable title -->
      <EditableInput v-model="model.title" @finishEditing="handleTitleEditFinished" class="max-w-10rem overflow-hidden"/>
      <!-- Button to remove the column -->
      <i class="pi pi-trash remove-button" @click="$emit('removeColumn', id)"></i>
    </div>

    <!-- Draggable post-it container -->
    <transition-group>
      <draggable v-model="model.postIts" item-key="id" group="postItList" class="h-80" v-bind="dragOptions" @start="drag = true"
                 @end="drag = false">
        <template #item="{ element }">
          <PostIt :model="element" @cardClick="(cardId) => $emit('cardClick', cardId, id)" class="post-it-hover"/>
        </template>
        <template #footer>
          <div class="post-it h-3rem opacity-50 text-center post-it-hover" @click="$emit('addPostIt', id, model.postIts.length + 1)">+</div>
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

.h-80 {
  height: 80vh;
  overflow: auto;
}

.post-it-hover {
  transition: rotate 0.2s ease, box-shadow 0.2s ease;
}

.post-it-hover:hover {
  rotate: 2deg;
  box-shadow: 1px 5px 5px 1px rgba(0, 0, 0, 0.105);
}
</style>
