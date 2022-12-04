import { reactive } from 'vue'
import type { MessageItem } from '@/components/khrov-chat/interface/khrov-chat'

export function useChatListItemMsg(props: any) {
  const msgItem: MessageItem = reactive({})
  msgItem.msiTimeAlign = props.outgoing == null ? false : true
  msgItem.msiSentOrRcvd = props.outgoing == null ? 'Received' : 'Sent'
  msgItem.msiMsg = props.outgoing == null ? props.incoming : props.outgoing
  msgItem.msiClearFloat = props.outgoing == null ? 'Clear-left' : 'Clear-right'
  if (props.status === 'pending') msgItem.msiStatusOut = '◷'
  else if (props.status === 'sent') msgItem.msiStatusOut = '✓'
  else if (props.status === 'delivered') msgItem.msiStatusOut = '✓✓'
  else if (props.status === 'seen') msgItem.msiStatusOut = '👁'
  
  return { msgItem }
}
