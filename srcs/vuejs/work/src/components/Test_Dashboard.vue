<script setup lang="ts">
  import { RouterLink } from 'vue-router';
</script>

<template>
  <div id="Test_Dashboard">
    <p><RouterLink to="/">'/' is Yellow</RouterLink></p>
    <p><RouterLink to="/blue">'/blue' is Blue</RouterLink></p>
    <p><RouterLink to="/grey">'/grey' is Grey</RouterLink></p>
    <p><RouterLink to="/chat">'/chat' is Black</RouterLink></p>
  </div>
</template>

<style scoped>
#Test_Dashboard {
  background-color: green;
}
a {
  color: white;
  font-weight: bold;
}
</style>
