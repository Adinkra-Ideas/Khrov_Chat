export interface ChatBlocked {
  cbkKeyBuild: number;   // used for v-if of ChatBlockedItem container 
}
export interface ChatBlockedItem {
  cbiBlockPanelHeight: string;  // for togling 'block user' confirm show and hide
}
export interface ChatBuilder {
  cbdFakeLogin: string;  // used for holding the CSS value of either 'block' or 'none' required for toggling the TEST login(userId) box at point of entry
  cbdUserInput?: number; // used for v-model-ing(AKA catching in realtime) user's userId input typed into TEST login(userId) box at point of entry
}
export interface ChatInvite {
  civSearchInput: string;    // used for v-model-ing the search input field on tab where first time chatters are searched to begin new chat
  civContentOrNot: boolean;  // Used for v-if of container where the search result are built into fine listings
  civSearchLoading: boolean; // used for toggling loading bar for when Search awaiting API 
}
export interface ChatInviteItem {
  ciiMsgInput: string;   // simply used for v-model-ing new chat message input on the display where new users are searched
  ciiBlockPanelHeight: string;  // for togling 'block user' confirm show and hide
  ciiMsgPanelHeight: string;  // for togling 'message user' panel show and hide
}
export interface ChatList {
  chiUnionUnderFocus: number;  // Conversation ID of the client for the conversation last focused on(clicked into view). used for tracking default conversation to retrieve message in realtime (useful for when inside the conversation chatting)
  chiUnionIdOther?: number;     // used for catching chiUnionUnderFocus partner's conversation ID when cicking to see conversation messages from Chatlistview
  chiChatMsg?: string;          // used for v-model-ing client input when typing a chat message item
  chiMorphPartnerDp?: string;   // for Carrying Avatar of each conversation partner from chatlist to their message conversation focus page
  chiMorphPartnerUserId: number;   // for Carrying userId of each conversation partner from chatlist to their message conversation focus page
  chiMorphPartnerUName: string;   // for Carrying userName of each conversation partner from chatlist to their message conversation focus page
  chiMorphPartnerName?: string;   // for Carrying Name of each conversation partner from chatlist to their message conversation focus page
  chiMorphPartnerEmail?: string;   // for Carrying Email of each conversation partner from chatlist to their message conversation focus page
  chiMorphPartnerLastSeen?: Date;   // for Carrying Last seen of each conversation partner from chatlist to their message conversation focus page
  chiMorphBlockStatus?: boolean;   // for Carrying blockStatus of each conversation partner from chatlist to their message conversation focus page
  chiMorphUnbAllowed: boolean;   // for Carrying AllowedToUnblockStatus of each conversation partner from chatlist to their message conversation focus page
  chiChatConnsApiOk: number;     // used as a pseudo flag for checking if the API that returns the chatconnection is Ok, then rendering html divs along with other activities based on this
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
  cliLastMsg?: string | null;      // used for storing content of last chat msg item received from API. Nothing much
  cliDeliveryStat?: string;  // used for storing content of last chat msg item delivery status(if outgoing) received from API. Nothing much
 
}
export interface MessageItem {
  msiSentOrRcvd?: string;  // stores a value of 'Received' or 'Sent' depending on whether the chat msg item is incoming or outgoing. Used to set CSS class styling for the chat msg item automatically 
  msiMsg?: string | null;         // used for storing the chat message item. Whether incoming or outgoing
  msiTime?: string;        // used for storing the time property of the chat message item. Whether incoming or outgoing
  msiStatusOut?: string;    // used for storing the icons representing the delivery status of our outgoing chat msg item
  msiClearFloat?: string;   // used for choosing the CSS class for clearing the float at the bottom of the chat msg item rendered. It's value is either 'Clear-left' or 'Clear-right' which are names of CSS float-clearing classes
  msiTimeAlign?: boolean;   // HTML are naturally aligned left. Since our chat msg item can be either left(incoming), right(outgoing) aligned, we use this boolean to activate class that aligns the chat msg item right for outgoing
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