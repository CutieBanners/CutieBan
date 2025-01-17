<script setup lang="ts">
import CardList from "./PostItList.vue";
import Draggable from "vuedraggable";
import Modal from "./PostIdDetailModal.vue";
import {Button} from "primevue";
import {inject, onMounted, ref} from "vue";
import { PostItModel } from "@/models/PostItModel";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";
import anime from "animejs/lib/anime.es"; // Import the PostItModel
import EditableInput from "@/components/EditableInput.vue"; // Import the PostItModel

const projectService: ReactiveProjectService = inject('reactiveProjectService')!;
const scrollContainer = ref(null); // Reference to the scroll container
const isScrolling = ref(false); // Flag to disable draggable during scrolling
const isDragging = ref(false); // Flag to track dragging
const startX = ref(0); // Initial mouse position
const scrollLeft = ref(0); // Initial scroll position

const selectedCard = ref<{ cardId: number, columnId: number } | null>(null);

const addColumn = () => {
  projectService.addColumn("New Column");
};

const removeColumn = (columnId: number) => {
  projectService.removeColumn(columnId);
};

const handleCardClick = (cardId: number, columnId: number) => {
  selectedCard.value = { cardId, columnId };
};

const addPostIt = (columnId: number) => {
  projectService.createPostIt(columnId,new PostItModel(Date.now(), "New Post-It", "", "#ffedaf", null, [], []));
};

const closeModal = () => {
  selectedCard.value = null; // Reset the selected card
};

const removeCard = (id: number) => {
  if (selectedCard.value) {
    projectService.deletePostIt(selectedCard.value.columnId, id);
    selectedCard.value = null; // Reset the selected card
  }
};
const dragOptions = ref({
  animation: 200,
  disabled: false,
  ghostClass: 'ghost',
});

const drag = ref(false);

const startAnimation = () => {

  let postIts = document.querySelectorAll(".vertical_line:not(.animated)");

  for (let i = 0; i < postIts.length; i++) {
    postIts[i].classList.add("animated");
    postIts[i].style.transform = "translateY(30vh)";
  }


  anime({
    targets: postIts,
    translateY: 0,
    duration: 700,
    delay: anime.stagger(70, { start: 0 }),
    easing: 'easeInOutSine'
  });
}

onMounted(() => {
  startAnimation();
});

</script>

<template>
  <div class="">
    <div class="flex justify-content-center">
      <EditableInput v-model="projectService.currentProject.title" :isTitle="true" class="chewy-regular xl:max-w-30rem md:max-w-10rem"/>
    </div>

    <div class="">
      <transition-group>
        <draggable
            v-model="projectService.currentProject.postItList"
            item-key="id"
            group="project"
            class="project"
            v-bind="dragOptions"
            @start="drag = true"
            :handle="'.drag-handle'"
            @end="drag = false"
        >
          <template #item="{ element }">
            <CardList :id="element.id" @removeColumn="removeColumn" @cardClick="handleCardClick" @addPostIt="addPostIt" class="h-full column-width vertical_line"/>
          </template>
          <template #footer>
            <Button @click="addColumn" @touchend="addColumn" class="h-fit p-2 column-width border-2">Add Column</Button>
          </template>
        </draggable>
      </transition-group>
    </div>

    <!-- Modal Component -->
    <Modal
        v-if="selectedCard"
        :selectedCard="selectedCard"
        @close="closeModal"
        @removeCard="removeCard"
    />
  </div>
</template>

<style scoped>
.project {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: auto;
}

.vertical_line {
  border-right: 2px dashed rgba(0, 0, 0, 0.1);
  margin-right: 10px;
  padding-right: 10px;
}

.column-width {
  flex: 0 0 250px;
}

@media only screen and (max-width: 600px) {
  .column-width {
    flex: 0 0 150px;
  }
}

.p-button {
  background-color: #fff5c6;
  border-color: #cdcab8;
  color: rgba(0,0,0,0.5);
}

.p-button:not(:disabled):hover{
  background-color: #ffedaf;
  border-color: #b8a558;
  color: rgba(0,0,0,1);
}
</style>
