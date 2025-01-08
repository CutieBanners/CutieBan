<script setup lang="ts">
import {defineProps, defineEmits, inject, computed} from "vue";
import EditableInput from "./EditableInput.vue";
import Editor from 'primevue/editor';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { ref } from "vue";
import {InputText} from "primevue";
import {ReactiveProjectService} from "@/services/ReactiveProjectService";
import anime from 'animejs/lib/anime.es.js';
import { onMounted } from "vue";


// Props to accept a PostItModel instance
const { selectedCard } = defineProps<{ selectedCard: { cardId: number, columnId: number } }>();
const projectService: ReactiveProjectService = inject('reactiveProjectService')!;
const postIt = computed(() => projectService.currentProject.postItList.find(column => column.id === selectedCard.columnId)!.postIts.find(postIt => postIt.id === selectedCard.cardId)!);
const opLabel = ref();
const opAssignee = ref();
const newTag = ref('');
const newAssignee = ref('');

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

const closeModal = async () => {
  await hideModalAnimation()
  emit("close");
}

const removeCard = () => {
  projectService.deletePostIt(selectedCard.columnId, selectedCard.cardId);
  closeModal();
}

const addTag = async () => {
  if (newTag.value.trim()) {
    await postIt.tags.push(newTag.value.trim());
    newTag.value = '';


    anime({
      targets: '#tag',
      translateX: [-50, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 40,
      delay: anime.stagger(100, { start: 0 }),
    });
  }
  else {
    document.getElementById("input-tag").style.borderColor = "red";

    anime({
      targets: '#input-tag',
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

const addAssignee = async () => {
  if (newAssignee.value.trim()) {
    await postIt.assignees.push(newAssignee.value.trim());
    newAssignee.value = '';

    anime({
      targets: '#assignees',
      translateX: [-50, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 40,
      delay: anime.stagger(100, { start: 0 }),
    });
  }
  else {
    document.getElementById("input-assignee").style.borderColor = "red";

    anime({
      targets: '#input-assignee',
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

const toggleLabel = (event) => {
  opLabel.value.toggle(event);
}
const toggleAssignee = (event) => {
  opAssignee.value.toggle(event);
}

const removeTag = (index: number) => {
  postIt.tags.splice(index, 1);
};

const removeAssignee = (index: number) => {
  postIt.assignees.splice(index, 1);
};

const showModalAnimation = () => {
  return new Promise((resolve) => {
    anime({
      targets: '#modal-post-it',
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 600,
      easing: 'easeOutExpo',
    });
  });
};

const hideModalAnimation = () => {
  return new Promise((resolve) => {
    anime({
      targets: '#modal-post-it',
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 600,
      easing: 'easeInExpo',
      complete: () => {
        document.querySelector('#modal-post-it').style.display = 'none';
        resolve();
      },
    });
  });
};

onMounted(() => {
  showModalAnimation();
});

</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div id="modal-post-it" class="w-10 p-3 post-it" @click.stop>

      <!-- Editable Title -->
      <div class="flex align-items-center justify-content-between h-3rem w-full">
        <i class="pi pi-pen-to-square"></i>
        <EditableInput
            v-model="postIt.title"
            @update:modelValue="updateTitle"
            class="cursor-pointer header-card-name"
        />
        <i class="pi pi-times cursor-pointer" @click="closeModal"></i>
      </div>

      <div class="flex gap-3 w-full">
        <div>
          <div>
            <strong>Assignees:</strong>
          </div>
          <!-- Conteneur de boutons avec retour à la ligne automatique -->
          <div class="grid grid-nogutter">
            <div
                v-for="(assignee, index) in postIt.assignees"
                :key="index"
                class="flex justify-content-start mb-2"
            >
              <Button
                  severity="contrast"
                  variant="outlined"
                  size="small"
                  class="text-sm max-w-5rem overflow-x-auto"
                  @click="removeAssignee(index)"
                  id="assignees"
              >
                {{assignee}}
              </Button>
            </div>
            <!-- Bouton Ajouter -->
            <div class="col-4 flex justify-content-start mb-2">
              <Button
                  type="button"
                  icon="pi pi-plus"
                  severity="contrast"
                  variant="outlined"
                  size="small"
                  label=""
                  @click="toggleAssignee"
              />
            </div>
          </div>

          <!-- Popover pour ajouter un tag -->
          <Popover ref="opAssignee">
            <div>
              <div>
                <span class="font-medium block mb-2">Assignees</span>
                <InputGroup>
                  <InputText v-model="newAssignee" placeholder="John Doe" class="mr-1" id="input-assignee"/>
                  <Button
                      label="Add"
                      severity="contrast"
                      variant="outlined"
                      size="small"
                      @click="addAssignee"
                  />
                </InputGroup>
              </div>
            </div>
          </Popover>
        </div>

        <div>
          <div>
            <strong>Tags:</strong>
          </div>
          <!-- Conteneur de boutons avec retour à la ligne automatique -->
          <div class="grid grid-nogutter">
            <div
                v-for="(tag, index) in postIt.tags"
                :key="index"
                class="flex justify-content-start mb-2"
            >
              <Button
                  severity="contrast"
                  variant="outlined"
                  size="small"
                  class="text-sm max-w-5rem overflow-x-auto"
                  @click="removeTag(index)"
                  id="tag"
              >
                {{ tag }}
              </Button>
            </div>
            <!-- Bouton Ajouter -->
            <div class="col-4 flex justify-content-start mb-2">
              <Button
                  type="button"
                  icon="pi pi-plus"
                  severity="contrast"
                  variant="outlined"
                  size="small"
                  label=""
                  @click="toggleLabel"
              />
            </div>
          </div>

          <!-- Popover pour ajouter un tag -->
          <Popover ref="opLabel">
            <div>
              <div>
                <span class="font-medium block mb-2">Label</span>
                <InputGroup>
                  <InputText v-model="newTag" placeholder="Tag name" class="mr-1" id="input-tag"/>
                  <Button
                      label="Add"
                      severity="contrast"
                      variant="outlined"
                      size="small"
                      @click="addTag"
                  />
                </InputGroup>
              </div>
            </div>
          </Popover>
        </div>
        <div>
          <div><strong>Due Date:</strong></div>
          <DatePicker v-model="postIt.endDate" />
        </div>
      </div>

      <!-- Editable Description -->
      <h2>Description</h2>
      <Editor
          editorStyle="height: 320px"
          v-model="postIt.description"
          @update:modelValue="updateDescription"
          class="editor_text_sizing"
      />
      <div class="modal-buttons">
        <Button @click="removeCard" label="Remove Card" severity="danger" size="small"></Button>
        <Button @click="closeModal" label="Save" severity="success" size="small"></Button>
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

.header-card-name {
  max-width: 90%;
}

.p-editor * {
  font-size: 1rem;
}
</style>
