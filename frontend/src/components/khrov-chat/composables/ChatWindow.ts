import { reactive } from 'vue'
import type { ChatWindow } from '@/components/khrov-chat/interface/khrov-chat'

export function useChatWindow() {
  const cWd: ChatWindow = reactive({
    chnList: 'Chats-tab'
  })
  
  const changeActiveTab = (class_name: string) => {
    if (!class_name.match(/^Chats-tab$|^Chatinv-tab$|^Channels-tab$|^ChannCreat-tab$/)) {
      return
    }
    cWd.chnList = class_name
  }
  
  return { cWd, changeActiveTab }
}
