<script setup lang="ts">
import { RouterView } from 'vue-router';
import ChatBuilder from '@/components/khrov-chat/ChatBuilder.vue';

import Test_Dashboard from '@/components/Test_Dashboard.vue';

</script>

<template>
  <header id="Head">
    <ChatBuilder />

    <Test_Dashboard />  
    <RouterView />
  </header>

</template>

<style scoped>
#Head {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50vh 50vh;
}
@media (min-width: 700px) {
  
}
</style>
