<script setup lang="ts">
import {Button, Drawer, Menu} from "primevue";
import {inject, ref} from "vue";
import {ProjectLinkModel} from "@/models/ProjectLinkModel";
import {RecentProjectsService} from "@/services/RecentProjectsService";
const visible : boolean = ref(false)

const recentProjects: RecentProjectsService = inject('recentProjectsService')!;
const projects : ProjectLinkModel[] = recentProjects.getRecentProjects();

</script>

<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible" header="CutieBan" id="drawer">
      <RouterLink to="/" @click="visible = false" @touchend="visible = false"><h3 class="animated-link"><i class="pi pi-home"></i> Home</h3></RouterLink>
      <h3><i class="pi pi-bookmark-fill"></i> Saved</h3>
      <ul>
        <div v-for="project in projects">
          <RouterLink
              :to="{ name: 'project', params: { id: project.id } }"
              @click="visible = false"
              @touchend="visible = false"
          >
            <li class="animated-link w-auto">
              <i class="pi pi-angle-right animated-icon"></i>
              <span>{{project.title}}</span>
            </li>
          </RouterLink>
        </div>
      </ul>
    </Drawer>
    <Button icon="pi pi-bars" @click="visible = true" @touchend ="visible = true" severity="secondary"/>
  </div>
</template>

<style scoped>
Button{
  position: absolute;
}
ul {
  padding-left: 1rem;
}

li {
  padding: 0.5rem 0;
  list-style: none;
}

a {
  text-decoration: none;
  color: black;
}

Button {
  background-color: #ffedaf;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

Button:enabled:hover {
  background-color: #d3b344;
  border: 1px solid rgba(0, 0, 0, 0.5);
}

Button:enabled:active {
  background-color: #d3b344;
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>