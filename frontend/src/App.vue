<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue';
import ChatBuilder from '@/components/khrov-chat/ChatBuilder.vue'
</script>

<template>
  <header>
    <ChatBuilder />
    <TheHeader />
  </header>
  <section>
    <RouterView />
  </section>
  <footer>
  </footer>
</template>

<style scoped>

</style>
