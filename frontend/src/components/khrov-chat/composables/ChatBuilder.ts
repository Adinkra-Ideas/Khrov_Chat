import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChatBuilder() {
  const startChat = ref<number>(0)

  const authStore = useAuthStore()
  const { fetchForKhrov } = useGlobal()


  const ApiHealth = async () => {
    await fetchForKhrov('/chats/app/plugin/chat/health', 'PUT', {});
  }
  
  const closeChatWindow = (e: Event) => {
    const chatWindow = document.getElementById('ChatWindow-container')
    const chatIcon = document.getElementById('ChatIcon-container')
  
    if (chatWindow && chatIcon) {
      if (!chatWindow.contains(e.target as Node) && !chatIcon.contains(e.target as Node)) {
        chatWindow.style['display'] = 'none'
      }
    }
  }
  
  const openChatWindow = () => {
    const chatWindow = document.getElementById('ChatWindow-container')
    if (chatWindow) {
      chatWindow.style['display'] = 'block'
    }
  }

  watch(() => authStore.isLoggedIn, (newStatus: any) => { if (newStatus===true) ApiHealth(); })

  onMounted(() => {
    document.addEventListener('click', closeChatWindow, false)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', closeChatWindow, false)
  })
  
  return { startChat, ApiHealth, closeChatWindow, openChatWindow }
}
