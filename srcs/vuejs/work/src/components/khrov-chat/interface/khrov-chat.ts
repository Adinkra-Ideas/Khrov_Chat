export interface ChatBlocked {
  cbkKeyBuild: number;   
}
export interface ChatBlockedItem {
  cbiBlockPanelHeight: string;  
}
export interface ChatWindow {
  chnList: string;
}
export interface ChatBuilder {
  cbdFakeLogin: string;  
  cbdUserInput?: number; 
}
export interface ChatInvite {
  civSearchInput: string;    
  civContentOrNot: boolean;  
  civSearchLoading: boolean; 
  civLiFirstIsActive: boolean;  
}
export interface ChatInviteItem {
  ciiMsgInput: string;   
  ciiBlockPanelHeight: string;  
  ciiMsgPanelHeight: string;  
}
export interface ChatList {
  chiUnionUnderFocus: number;  
  chiUnionIdOther?: number;     
  chiChatMsg?: string;          
  chiMorphPartnerDp?: string;   
  chiMorphPartnerUserId: number;   
  chiMorphPartnerUName: string;   
  chiMorphPartnerName?: string;   
  chiMorphPartnerEmail?: string;   
  chiMorphPartnerLastSeen?: Date;   
  chiMorphBlockStatus?: boolean;   
  chiMorphUnbAllowed: boolean;   
  chiChatConnsApiOk: number;     
}
export interface ChatListTmp {
  outgoing: string,
  incoming: null,
  time: string,
  deliveryStatus: string,
  unionId?: number,
  unionIdOther?: number
}
export interface ChatListItem {
  cliLastMsg?: string | null;      
  cliDeliveryStat?: string;  

}
export interface MessageItem {
  msiSentOrRcvd?: string;  
  msiMsg?: string | null;         
  msiTime?: string;        
  msiStatusOut?: string;    
  msiClearFloat?: string;   
  msiTimeAlign?: boolean;   
}

export interface UserTb {
  id: number,
  userName: string,
  displayName: string,
  activated2FA: boolean,
  email: string,
  name: string,
  createdAt: Date,
  updatedAt: Date,
  profile_pics: Profile_picTb[],
  chat_union1: Chat_unionTb[],
  chat_union2: Chat_unionTb[]
}
export interface Chat_unionTb {
  unionId: number,
  unionIdOther: number,       
  client1: UserTb,
  client1Id: number,
  client2: UserTb,
  client2Id: number,
  blockStatus: boolean,
  allowedToUnblock: boolean,
  unreadCount: number,
  createdAt: Date,
  updatedAt: Date,
  chat_historys: Chat_historyTb[],
}
export interface Profile_picTb {
  user: UserTb,
  userId: number,       
  avatar: string,
}
export interface Chat_historyTb {
  id: number,
  unionId: number,
  outgoing: string,
  incoming: string,
  deliveryStatus: string,
}

export interface ChnListOfflineCache {
  userId: number,   
  chId: number,     
  msg: string,      
  time: string,     
}