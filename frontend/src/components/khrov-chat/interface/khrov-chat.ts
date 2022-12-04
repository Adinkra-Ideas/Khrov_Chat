export interface ChatBlocked {
  cbkKeyBuild: number
  output?: Chat_unionTb[]
}
export interface ChatBlockedItem {
  cbiBlockPanelHeight: string
}
export interface ChatWindow {
  chnList: string
}
export interface ChatInvite {
  civSearchInput: string
  civContentOrNot: boolean
  civSearchLoading: boolean
  civLiFirstIsActive: boolean
  datas?: UserTb[]
}
export interface ChatInviteItem {
  ciiMsgInput: string
  ciiBlockPanelHeight: string
  ciiMsgPanelHeight: string
}
export interface ChatList {
  chiUnionUnderFocus: number
  chiUnionIdOther?: number
  chiChatMsg?: string
  chiMorphPartnerDp?: string
  chiMorphPartnerUserId: number
  chiMorphPartnerUName: string
  chiMorphPartnerName?: string
  chiMorphPartnerEmail?: string
  chiMorphPartnerLastSeen?: Date
  chiMorphBlockStatus?: boolean
  chiMorphUnbAllowed: boolean
  chiChatConnsApiOk: number
  notifDiff: number
  loading: boolean
}
export interface ChatListTmp {
  outgoing: string
  incoming: null
  time: string
  deliveryStatus: string
  unionId?: number
  unionIdOther?: number
}
export interface ChatListItem {
  cliLastMsg?: string | null
  cliDeliveryStat?: string
}
export interface MessageItem {
  msiSentOrRcvd?: string
  msiMsg?: string | null
  msiTime?: string
  msiStatusOut?: string
  msiClearFloat?: string
  msiTimeAlign?: boolean
}

export interface UserTb {
  id: number
  userName: string
  displayName: string
  activated2FA: boolean
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
  profile_pics: Profile_picTb[]
  chat_union1: Chat_unionTb[]
  chat_union2: Chat_unionTb[]
}
export interface Chat_unionTb {
  unionId: number
  unionIdOther: number
  client1: UserTb
  client1Id: number
  client2: UserTb
  client2Id: number
  blockStatus: boolean
  allowedToUnblock: boolean
  unreadCount: number
  createdAt: Date
  updatedAt: Date
  chat_historys: Chat_historyTb[]
}
export interface Profile_picTb {
  user: UserTb
  userId: number
  avatar: string
}
export interface Chat_historyTb {
  id: number
  unionId: number
  outgoing: string
  incoming: string
  deliveryStatus: string
}

export interface ChnListOfflineCache {
  chId: number
  msg: string
  time: string
}

export interface ChList {
  channConn: ChnListChannConn[]
  chlItemActive: boolean
  chlMsgsActive: boolean
  chlModActive: boolean
  chlVisibilityOfFocus: string
  chlIdOfFocus: number
  chlNameOfFocus: string
  chlDescOfFocus: string
  chlRoleOfFocus: string
  linkStatusOfFocus: string
  mutedUntilOfFocus: string
  chlMsgOrModerate: boolean
  chlMsgInput: string
  modGetUserIdArrowRotate: string
  modGetUserIdBoxDisplayToggle: string
  modMakeUserAdminArrowRotate: string
  modMakeUserAdminBoxDisplayToggle: string
  modModifyChannelArrowRotate: string
  modModifyChannelBoxDisplayToggle: string
  modPendingRequestsArrowRotate: string
  modPendingRequestsBoxDisplayToggle: string
  modGetUserIdInput: string
  notifMsg: string
  modModerMemberId: string
  modModerSelectAction: string
  modModerMuteMins: string
  notifModerMsg: string
  modModifySelectVisi: string
  modModifyPwd: string
  notifModifyMsg: string
  getPendingsObj: ChnListPendingList[]
  getPendingsObjRef: number
  notifDiff: number
}

export interface ChnListChannConn {
  chId: number
  role: string
  unreadCount: number
  linkStatus: string
  mutedUntil: string
  ch: {
    name: string
    desc: string
    visibility: string
  }
}

export interface ChnListPendingList {
  userId: number
  chId: number
  user: {
    userName: string
  }
}

export interface ChNewSearchOutput {
  id: number
  name: string
  desc: string
  visibility: string
  role: string
}

export interface ChNew {
  chnLiFirstIsActive: boolean
  chnLiSecondIsActive: boolean
  chnNameInput: string
  chnVisiSelect: string
  chnPassInput: string
  chnPassValidatorField: string
  chnChPassLowercase: string
  chnChPassUppercase: string
  chnChPassNumber: string
  chnChPassLength: string
  chnDescInput: string
  chnError: string
  chnSearchInput: string
  renderSearchOutput: boolean
  chnSearchLoading: boolean
  suggestionsOutput: ChNewSearchOutput[]
  suggestionsOutputRef: number
  searchOutput: ChNewSearchOutput[]
  searchOutputRef: number
}

export interface ChNwItJoinStatus {
  cniConfirmHeight: string
  cniPwdConfirmHeight: string
  cniPwdInput: string
}

export interface ChNwItInternal {
  partake: boolean
  joinExitFlag: boolean
  visImage: string
}
