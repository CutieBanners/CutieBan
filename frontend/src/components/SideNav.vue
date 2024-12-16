<script setup lang="ts">
import {Button, Drawer, Menu} from "primevue";
import {inject, ref} from "vue";
import {ProjectLinkModel} from "@/models/ProjectLinkModel";
import {CrudService} from "@/services/CrudService";
import {RecentProjectsService} from "@/services/RecentProjectsService";
const visible : boolean = ref(false)

const crudService : CrudService = inject('crudService')!;
const recentProjects: RecentProjectsService = inject('recentProjectsService')!;
const projects : ProjectLinkModel[] = recentProjects.getRecentProjects();

</script>

<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible" header="CutieBan">
      <h3><i class="pi pi-bookmark-fill"></i> Saved</h3>
      <ul>
        <div v-for="project in projects">
          <RouterLink
              :to="{ name: 'project', params: { id: project.id } }"
              @click="visible = false"
          >
            <li>
              <i class="pi pi-angle-right"></i>
              <span>{{project.title}}</span>
            </li>
          </RouterLink>
        </div>
      </ul>
    </Drawer>
    <Button icon="pi pi-bars" @click="visible = true" severity="secondary"/>
  </div>
</template>

<style scoped>
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
</style>