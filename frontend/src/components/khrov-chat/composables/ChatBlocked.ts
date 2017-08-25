import { reactive, onMounted } from 'vue'
import { socket } from '@/sockets/sockets'
import type { ChatBlocked } from '@/components/khrov-chat/interface/khrov-chat'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChatBlocked() {
  const cBlkd: ChatBlocked = reactive({
    cbkKeyBuild: 0
  })

  const { fetchForKhrov } = useGlobal()

  const searchBlocked = async () => {
    const response = await fetchForKhrov(`/chats/blocked/search`, 'GET', {});
    if (response) {
      try {
        if (!response.ok) throw response;
        const jsonObj = await response.json();
        if (JSON.stringify(cBlkd.output) != JSON.stringify(jsonObj)) {
          cBlkd.output = jsonObj
          cBlkd.cbkKeyBuild += 1
        }
      } catch {/* Do nothing */}
    }
  }

  onMounted(() => {
    searchBlocked();
    socket.on('new-chat-event', (/*id: number*/) => {
      // Todo make this blocked more responsive 
      // const found: boolean = chatCache.hasOwnProperty(id)
      // if (found || id === 0) {
        searchBlocked();
      // }
    })
  })

  return { cBlkd, searchBlocked }
}
