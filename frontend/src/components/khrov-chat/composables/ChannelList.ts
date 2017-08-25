import { reactive, onMounted, watch } from 'vue'
import { useChatsStore } from '@/stores/khrov-chat/chats'
import { socket } from '@/sockets/sockets'
import type {
  ChnListOfflineCache, 
  ChList,
  ChnListChannConn,
} from '@/components/khrov-chat/interface/khrov-chat'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChannelList() {
  const chList: ChList = reactive({
    channConn: [],
    chlItemActive: true,
    chlMsgsActive: false,
    chlModActive: false,
    chlVisibilityOfFocus: '',
    chlIdOfFocus: 0,
    chlNameOfFocus: '',
    chlDescOfFocus: '',
    chlRoleOfFocus: '',
    linkStatusOfFocus: '',
    mutedUntilOfFocus: '',
    chlMsgOrModerate: true,
    chlMsgInput: '',
    modGetUserIdArrowRotate: 'rotate(0deg)',
    modGetUserIdBoxDisplayToggle: '0px',
    modMakeUserAdminArrowRotate: 'rotate(0deg)',
    modMakeUserAdminBoxDisplayToggle: '0px',
    modModifyChannelArrowRotate: 'rotate(0deg)',
    modModifyChannelBoxDisplayToggle: '0px',
    modPendingRequestsArrowRotate: 'rotate(0deg)',
    modPendingRequestsBoxDisplayToggle: '0px',
    modGetUserIdInput: '',
    notifMsg: '',
    modModerMemberId: '',
    modModerSelectAction: '',
    modModerMuteMins: '',
    notifModerMsg: '',
    modModifySelectVisi: '',
    modModifyPwd: '',
    notifModifyMsg: '',
    getPendingsObj: [],
    getPendingsObjRef: 0,
    notifDiff: 0
  })
  const channCache: any = reactive({})
  const offlineCache: ChnListOfflineCache[] = []

  const chatsStore = useChatsStore()
  const { fetchForKhrov } = useGlobal()

  const calculateChannNotif = (channConn: ChnListChannConn[]): number => {
    let total: number = 0;
    for (const key in channConn) {
      const oneChann = channConn[key];
      total += oneChann.unreadCount;
    }
    return total ;
  }

  const getChannelPreviews = async () => {
    const response = await fetchForKhrov(`/channels/get/connections/get`, 'GET', {});
    if (response) {
      try {
        if (!response.ok) throw response;
        const jsonObj = await response.json();
        if (JSON.stringify(jsonObj) != JSON.stringify(chList.channConn)) {
          chList.channConn = jsonObj
          chList.notifDiff = calculateChannNotif(chList.channConn);
        }
        if (chList.chlIdOfFocus != 0) {
          getFocusedChannelHistory()
        }
      } catch {/* Do nothing */}
    }
  }

  const getFocusedChannelHistory = async () => {
    const response = await fetchForKhrov(`/channels/get/connections/chann/${chList.chlIdOfFocus}`, 'GET', {});
    if (response) {
      try {
        if (!response.ok) {
          chList.chlIdOfFocus = 0;
          throw response;
        }
        const jsonObj = await response.json();
        if (!offlineCache.length &&
            JSON.stringify(jsonObj) != JSON.stringify(channCache[chList.chlIdOfFocus])) {
            channCache[chList.chlIdOfFocus] = jsonObj
        }
      } catch {/* Do nothing */}
    }
  }

  const submitChannMsg = async () => {
    if ( !chList.chlMsgInput ||
       ( chList.chlMsgInput && (chList.chlMsgInput.trimStart()).length == 0) ) {
      return
    }
    const offlineAppend = {
      outgoing: chList.chlMsgInput as string,
      createdAt: new Date().toISOString(),
      deliveryStatus: 'pending',
      user: {
        userName: 'ME'
      }
    }
    channCache[chList.chlIdOfFocus] = [offlineAppend, ...channCache[chList.chlIdOfFocus]]
    const tmp = {
      chId: chList.chlIdOfFocus,
      msg: chList.chlMsgInput as string,
      time: new Date().toISOString()
    }
    offlineCache.push(tmp)
    chList.chlMsgInput = ''
    const response = await fetchForKhrov('/channels', 'PUT', offlineCache);
    if (response) 
      if (response.ok)
        offlineCache.length = 0;
  }

  const setSeen = async (chId: number) => {
    const tmp = {
      chId: chId
    }
    await fetchForKhrov(`/channels/put/set-seen`, 'PUT', tmp);
  }

  const changeActiveBox = (name: string) => {
    if (!name.match(/^Chl-item$|^Chl-msgs$|^Chl-mod$/)) {
      return
    }
  
    chList.chlItemActive = name === 'Chl-item' ? true : false
    chList.chlMsgsActive = name === 'Chl-msgs' ? true : false
    chList.chlModActive = name === 'Chl-mod' ? true : false
  }

  const visibilityToImage = (visibility: string): string => {
    if (!visibility.match(/^public$|^private$|^password$/)) {
      return ''
    }
    const visImage: string = '/khrov-chat-media/Channel.png'
    if (visibility === 'public') {
      return visImage.substring(0, 18) + 'public' + visImage.substring(18)
    } else if (visibility === 'private') {
      return visImage.substring(0, 18) + 'private' + visImage.substring(18)
    }
    return visImage.substring(0, 18) + 'password' + visImage.substring(18)
  }
  
  const getUserID = async (userNameInput: string) => {
    chList.notifMsg = ''
    if (!userNameInput || userNameInput.length < 3) {
      chList.notifMsg = 'Input in "userName" must be more than 3 chars'
      return
    }
    const response = await fetchForKhrov(`/channels/?chId=${chList.chlIdOfFocus}&userName=${userNameInput}`, 'GET', {});
    if (response) {
      try {
        if (!response.ok) throw response;
        chList.modGetUserIdInput = ''
        const jsonObj = await response.json();
        chList.notifMsg = jsonObj.message
      } catch {/* Do nothing */}
    }
  }
  
  const moderateMembers = async () => {
    chList.notifModerMsg = ''
  
    if (!parseInt(chList.modModerMemberId) || parseInt(chList.modModerMemberId) < 1) {
      chList.notifModerMsg = 'Input in "member Id" must be greater than 0'
      return
    }
  
    if (!chList.modModerSelectAction) {
      chList.notifModerMsg = 'Please select an option under "Select Action"'
      return
    }
  
    if (chList.modModerSelectAction === 'mute' && !chList.modModerMuteMins) {
      chList.notifModerMsg = 'Please enter number of minutes to mute'
      return
    }
  
    const muteTime = parseInt(chList.modModerMuteMins) ? parseInt(chList.modModerMuteMins) : 0
    const currentTime = new Date()
    const mutedUntil = new Date(currentTime.getTime() + 1000 * 60 * muteTime)
  
    const tmp = {
      chId: chList.chlIdOfFocus,
      userId: parseInt(chList.modModerMemberId),
      action: chList.modModerSelectAction,
      mutedUntil: mutedUntil.toISOString()
    }
  
    const response = await fetchForKhrov(`/channels/put/channel/moderate`, 'PUT', tmp);
    if (response) {
      try {
        if (!response.ok) throw response;
        chList.modModerMemberId = ''
        chList.modModerSelectAction = ''
        chList.modModerMuteMins = ''
        const jsonObj = await response.json();
        chList.notifModerMsg = jsonObj.message
      } catch {/* Do nothing */}
    }
  }
  
  const modifyChannel = async () => {
    chList.notifModifyMsg = ''
  
    if (!chList.modModifySelectVisi.match(/^public$|^private$|^password$/)) {
      chList.notifModifyMsg = 'Please Select a Channel Visibility Option!'
      return
    }
    if (
      chList.modModifySelectVisi === 'password' &&
      !chList.modModifyPwd.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])^[a-zA-Z\d]{6,20}$/)
    ) {
      chList.notifModifyMsg =
        'Password must contain an Uppercase, Lowercase and Decimal. Length must be between 6 - 20 chars.'
      return
    }
  
    const passTmp = chList.modModifySelectVisi === 'password' ? chList.modModifyPwd : 'Abc123'
  
    const tmp = {
      chId: chList.chlIdOfFocus,
      newVisibility: chList.modModifySelectVisi,
      password: passTmp
    }
  
    const response = await fetchForKhrov('/channels/put/channel/moderate/modify', 'PUT', tmp);
    if (response) {
      try {
        if (!response.ok) throw response;
        chList.modModifySelectVisi = ''
        chList.modModifyPwd = ''
        const jsonObj = await response.json();
        chList.notifModifyMsg = jsonObj.message
      } catch {/* Do nothing */}
    }
  }
  
  const getAllPending = async () => {
    chList.getPendingsObj.length = 0
  
    const response = await fetchForKhrov(`/channels/get/channel/moderate/true/${chList.chlIdOfFocus}`, 'GET', {});
    if (response) {
      try {
        if (!response.ok) throw response;
        const jsonObj = await response.json();
        chList.getPendingsObj = jsonObj
        chList.getPendingsObjRef += 1
      } catch {/* Do nothing */}
    }
  }
  
  const approveOrReject = async (choice: boolean, memberId: number) => {
    const tmp = {
      chId: chList.chlIdOfFocus,
      memberId: memberId,
      action: choice
    }
    const response = await fetchForKhrov('/channels/put/channel/moderate/pending/decide', 'PUT', tmp);
    if (response && response.ok) getAllPending();
  }

  watch(() => chList.notifDiff, async (curr: any, expired: any) => {
    if (curr > expired) {
      const there_be_sounds = new Audio(chatsStore.getKhrovCelestial);  
      there_be_sounds.play();
      chatsStore.manageAllNotifCounter(0, curr);
    }
  })
  
  onMounted(() => {
    getChannelPreviews();
    socket.on('new-channel-event', (id: number) => {
      const found = chList.channConn.find((element) => element.chId===id)
      if (found !== undefined || id === 0) {
        getChannelPreviews();
      }
    })
  })
  
  return { 
    chList, 
    channCache, 
    offlineCache, 
    calculateChannNotif,
    getChannelPreviews,
    getFocusedChannelHistory,
    submitChannMsg,
    setSeen,
    changeActiveBox,
    visibilityToImage,
    getUserID,
    moderateMembers,
    modifyChannel,
    getAllPending,
    approveOrReject
  }
}
