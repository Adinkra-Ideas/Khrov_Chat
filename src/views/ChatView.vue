<script setup lang="ts">
  // import ChatBuilder from '@/components/ChatBuilder.vue';
  import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div id="ChatView">
    <RouterLink to="/chat/chaty">open sub route</RouterLink><br />
    <RouterView />
  </div>
</template>

<style scoped>
#ChatView {
  background-color: black;
}
</style>