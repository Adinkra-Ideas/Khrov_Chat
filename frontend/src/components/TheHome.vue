<script setup lang="ts">
  import { useTheHome } from '@/components/composables/TheHome'
  import { useAuthStore } from '@/stores/auth'

  const { tbt, onSignIn, onSignout } = useTheHome()
  const authStore = useAuthStore()
  
</script>

<template>
  <div>
  </div>
</template>

<style scoped>

</style>