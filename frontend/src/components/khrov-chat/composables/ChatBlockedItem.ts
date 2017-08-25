import { reactive } from 'vue'
import { layer } from '@layui/layer-vue'
import type { ChatBlockedItem } from '@/components/khrov-chat/interface/khrov-chat'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChatBlockedItem() {
  const cbItem: ChatBlockedItem = reactive({
    cbiBlockPanelHeight: '0px'
  })

  const { fetchForKhrov } = useGlobal()

  
  const unblockUser = async (blocked: number, partner: string) => {
    const tmp = {
      blockedId: blocked
    }
    const response = await fetchForKhrov('/chats/block/user/unblock', 'PUT', tmp);
    if (response && response.ok) {
      layer.msg(`You have unblocked ${partner} successfully!`, { time: 5000 })
    } else {
      layer.msg(`Could not unblock ${partner}!`, { time: 5000 })
    }
  }

  return { cbItem, unblockUser }
}
