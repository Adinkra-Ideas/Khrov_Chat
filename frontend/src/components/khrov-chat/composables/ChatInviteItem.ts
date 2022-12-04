import { reactive } from 'vue'
import { layer } from '@layui/layer-vue'
import { useChatsStore } from '@/stores/khrov-chat/chats'
import type { ChatInviteItem } from '@/components/khrov-chat/interface/khrov-chat'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChatInviteItem() {
  const ciItem: ChatInviteItem = reactive({
    ciiBlockPanelHeight: '0px',
    ciiMsgPanelHeight: '0px',
    ciiMsgInput: ''
  })

  const chatsStore = useChatsStore()
  const { fetchForKhrov } = useGlobal()
  
  const sendNewMsg = async (theirId: number) => {
    if (ciItem.ciiMsgInput.length < 1) {
      return
    }
    const tmp = {
      receiverId: theirId,
      msg: ciItem.ciiMsgInput
    }
    const response = await fetchForKhrov('/chats', 'POST', tmp);
      if (response) {
        try {
          if (!response.ok) {
            layer.msg('Message could not be sent', { time: 5000 })
            throw response
          }
          ciItem.ciiMsgInput = ''
          ciItem.ciiMsgPanelHeight = '0px'
          layer.msg('Message sent Successfully', { time: 5000 })
        } catch {/* Do nothing */}
      }
  }
  
  const blockUser = async (blocked: number, partner: string) => {
    const tmp = {
      blockedId: blocked
    }
    const response = await fetchForKhrov('/chats/block/user', 'PUT', tmp);
    if (response) {
      if (response.ok) {
        layer.msg(`You have blocked ${partner} successfully!`, { time: 5000 })
      } else {
        layer.msg(`Could not block ${partner}!`, { time: 5000 })
      }
    }
  }
  
  return { ciItem, sendNewMsg, blockUser }
}
