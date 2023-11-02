import { reactive, onMounted, ref, watch } from 'vue'
import { layer } from '@layui/layer-vue'
import { useChatsStore } from '@/stores/khrov-chat/chats'
import { socket } from '@/sockets/sockets'
import type {
  ChatList, 
  ChatListTmp, 
  Chat_unionTb
} from '@/components/khrov-chat/interface/khrov-chat'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChatList() {
  const cList: ChatList = reactive({
    chiChatConnsApiOk: 0,
    chiUnionUnderFocus: 0,
    chiMorphPartnerUserId: 0,
    chiMorphPartnerUName: '',
    chiMorphUnbAllowed: false,
    notifDiff: 0,
    loading: false,
  })
  const tabsPart = reactive({
    ChatsListIsActive: true,
    SingleConversationIsActive: false,
    MyProfileIsActive: false,
    TheirProfileIsActive: false,
  })
  const styling = reactive({
    TopOfChatUlHeight: '0px',       
    DeleteConvLiDisplay: 'block',   
    ConfirmDeleteLiDisplay: 'none', 
    DisplayBlockingQuestion: 'block',     
    DisplayBlockingConfirm: 'none',     
    ProfileUlHeight: '0px',         
  })
  const chatCache: any = reactive({})
  const offlineCache: ChatListTmp[] = []
  const datas = ref<Chat_unionTb[]>([])

  const chatsStore = useChatsStore()
  const { fetchForKhrov } = useGlobal()


  const deleteConversation = async (unionId: number) => {
    const tmp = {
      'unionId': unionId,
    }
    const response = await fetchForKhrov('/chats', 'DELETE', tmp);
    if (response && response.ok) {
      layer.msg('Conversation Deleted Successfully!', {time:5000});
      getConversationPreviews()
    }
  }

  const blockUnblock = async (blocked: number, partner: string, flag: boolean) => {
    const tmp = {
      'blockedId': blocked,
    }
    let msg: string = `You have unblocked ${partner} successfully!` ;
    let route: string = '/chats';
    if (flag === true) {
      route += '/block/user';
      msg = msg.substr(0, 9) + msg.substr(11, msg.length);
    } else {
      route += '/block/user/unblock';
    }
    const response = await fetchForKhrov(route, 'PUT', tmp);
    if (response && response.ok) {
      layer.msg(msg, {time:5000});
    }
  }

  const setSeen = async (meReceiver: number, theySender: number) => {
    const tmp = {
      'meReceiver': meReceiver,
      'theySender': theySender
    }
    await fetchForKhrov('/chats/seen', 'PUT', tmp);
  }

  const submitChatMsg = async () => {
    if ( !cList.chiChatMsg ||
       ( cList.chiChatMsg && (cList.chiChatMsg.trimStart()).length == 0) ) {
      return ;
    }
    const tmp: ChatListTmp = {
        'outgoing': cList.chiChatMsg as string,
        'incoming': null,
        'time': new Date().toISOString(),
        'deliveryStatus': 'pending'
      };
    chatCache[cList.chiUnionUnderFocus] = [
      tmp, ...chatCache[cList.chiUnionUnderFocus]
    ];
    cList.chiChatMsg = '';
    tmp.unionId = cList.chiUnionUnderFocus;
    tmp.unionIdOther = cList.chiUnionIdOther;
    offlineCache.push(tmp);
    const response = await fetchForKhrov('/chats', 'PUT', offlineCache);
    if (response && response.ok) {
      offlineCache.length = 0;
    }
  }

  const calculateChatNotif = (datar : Chat_unionTb[]) : number => {
    let total: number = 0;
    for (const key in datar) {
      const oneUnion = datar[key];
      total += oneUnion.unreadCount;
    }
    return total ;
  }

  const getOneConversation = async () => {
    const response = await fetchForKhrov(`/chats?unionId=${cList.chiUnionUnderFocus}`, 'GET', {});
    if (response) {
      try {
        if (!response.ok) throw response;
        const jsonObj = await response.json();
        if (JSON.stringify(chatCache[cList.chiUnionUnderFocus]) != JSON.stringify(jsonObj.chat_historys)) {
          chatCache[cList.chiUnionUnderFocus] = jsonObj.chat_historys;            
        }
      } catch {/* Do nothing */}
    }
  }

  const getConversationPreviews = async () => {
    cList.loading = true;
    const response = await fetchForKhrov(`/chats/previews`, 'GET', {});
    if (response) {
      cList.loading = false;
      try {
        if (!response.ok) throw response;
        const jsonObj = await response.json();
        if (JSON.stringify(datas.value) != JSON.stringify(jsonObj)) {
          datas.value = jsonObj;
          cList.chiChatConnsApiOk+=1;
          cList.notifDiff = calculateChatNotif(datas.value);
        }
         
      } catch (error) {
         cList.chiChatConnsApiOk = cList.chiChatConnsApiOk ? 1 : 0;
      }
    }
    if (cList.chiChatConnsApiOk && cList.chiUnionUnderFocus){
      await getOneConversation();
    }
    cList.loading = false;
  }

  const changeActiveTab = (param : string) => {
    tabsPart.ChatsListIsActive = param === 'Chats-list' ? true : false;
    tabsPart.SingleConversationIsActive = param === 'Single-conversation' ? true : false;
    tabsPart.MyProfileIsActive = param === 'My-profile' ? true : false;
    tabsPart.TheirProfileIsActive = param === 'Their-profile' ? true : false;
  }
  
  watch(() => cList.notifDiff, async (curr: any, expired: any) => {
    if (curr > expired) {
      const there_be_sounds = new Audio(chatsStore.getKhrovCelestial);  
      there_be_sounds.play();
      chatsStore.manageAllNotifCounter(curr, 0);
    }
  })
 
  onMounted(() => {
    getConversationPreviews();
    socket.on('new-chat-event', (id: number) => {
      // Tricky Bug: getChatCache{key: {},...} key will be empty 
      // when no conversation has been clicked from preview yet
      let found: boolean = false;
      for (const key in datas.value) {
        const union = datas.value[key];
        if (union.unionId === id) {
          found = true;
          break ;
        }
      }
      if (found || id === 0) {
        getConversationPreviews();
      }
    })
  })
  
  return { 
    cList, 
    tabsPart, 
    styling, 
    chatCache, 
    offlineCache,
    datas,
    deleteConversation,
    blockUnblock,
    setSeen,
    submitChatMsg,
    calculateChatNotif,
    getOneConversation,
    getConversationPreviews,
    changeActiveTab
  }
}
