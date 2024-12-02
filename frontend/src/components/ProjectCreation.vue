<script setup lang="ts">
import {Button, InputText} from 'primevue';

</script>

<template>
<h1>Hey, what′s the big idea?</h1>
  <InputText type="text" v-model="value" placeholder="Apple"/>
  <Button>Create</Button>
</template>

<style scoped>

</style>