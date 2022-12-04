import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const loginStatus = ref<boolean>(false)

  const getLoginStatus = computed(() => loginStatus.value)

  const setLoginStatus = (newStatus: boolean) => {
    loginStatus.value = newStatus
  }

  return {
    getLoginStatus,
    setLoginStatus,

  }
})
