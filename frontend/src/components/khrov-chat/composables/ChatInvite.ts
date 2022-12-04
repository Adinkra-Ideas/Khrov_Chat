import { reactive } from 'vue'
import type { ChatInvite } from '@/components/khrov-chat/interface/khrov-chat'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChatInvite() {
  const cInvite: ChatInvite = reactive({
    civContentOrNot: false,
    civSearchLoading: false,
    civSearchInput: '',
    civLiFirstIsActive: true,
  })

  const { fetchForKhrov } = useGlobal()

  const searchUsers = async (key: string) => {
    cInvite.civContentOrNot = false
    cInvite.civSearchLoading = true
    if (key.length < 1) {
      cInvite.civSearchLoading = false
      return
    }
    const response = await fetchForKhrov(`/chats/get/search/user?key=${key}`, 'GET', {});
    if (response) {
      try {
        cInvite.civSearchLoading = false
        if (!response.ok) throw response
        const jsonObj = await response.json()
        cInvite.datas = jsonObj
        if (jsonObj.length > 0) {
          cInvite.civContentOrNot = true
        }
      } catch {/* Do nothing */}
    }
  }

  const switchChiActive = (name: string) => {
    if (!name.match(/^first$|^second$/)) {
      return
    }
    cInvite.civLiFirstIsActive = name === 'first' ? true : false
    cInvite.civLiFirstIsActive = name === 'second' ? false : true
  }

  return { cInvite, searchUsers, switchChiActive }
}
