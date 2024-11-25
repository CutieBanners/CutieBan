<script setup lang="ts">
import {Button, Drawer, Avatar} from "primevue";


import {ref} from "vue";
const visible = ref(false)

const saved = ["Saved 1", "Saved 2"]

</script>

<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible" header="CutieBan">
      <h3><i class="pi pi-bookmark-fill"></i> Saved</h3>
      <div></div>
    </Drawer>
    <Button icon="pi pi-arrow-right" @click="visible = true" />
  </div>
</template>

<style scoped>

</style>