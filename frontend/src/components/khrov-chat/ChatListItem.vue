<script setup lang="ts">
import { useChatListItem } from '@/components/khrov-chat/composables/ChatListItem'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

const props = defineProps<{
  unionId: number
  partnerId: number
  partnerUName: string
  partnerDp: string
  blockStatus: boolean
  allowedToUnblock: boolean
  unreadCount: number
  outgoingMsg: string | null
  incomingMsg: string | null
  time: string | Date
  deliveryStatus: string
}>()

const { cliItem } = useChatListItem(props)
const { trimDate } = useGlobal()
</script>
<template>
  <div class="Preview">
    <img id="Avatar" :src="partnerDp" alt="Avatar" />
    <div id="Chat-details">
      <span id="Header">{{ partnerUName }}</span>
      <span id="Time">{{ trimDate(time) }}</span>
      <span id="Message">{{ cliItem.cliLastMsg }}</span>
      <span id="Notification" v-if="unreadCount">{{ unreadCount }}</span>
      <span id="DeliveryStatus" v-if="!unreadCount && !incomingMsg">{{
        cliItem.cliDeliveryStat
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.Preview {
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: 40px;

  width: 100%;
  aspect-ratio: 6 / 1;
  padding: 5px;
  cursor: pointer;
}
.Preview:hover {
  background-color: #f5f5dc;
}

#Avatar {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

#Chat-details {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 20px 20px;

  width: 100%;
  height: 50%;
  padding-left: 10px;
}
#Chat-details > * {
  padding: 0 3px;
}
#Chat-details > #Header {
  grid-row: 1;
  grid-column: 1/5;

  font-family: verdana;
  font-size: 15px;
  font-weight: 500;
}
#Chat-details > #Time {
  grid-row: 1;
  grid-column: 5/5;

  font-size: 10px;
  color: rgb(139, 137, 137);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#Chat-details > #Message {
  grid-row: 2;
  grid-column: 1/6;

  width: 100%;
  height: 100%;
  font-size: 13px;
  color: rgb(139, 137, 137);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#Chat-details > #Notification {
  grid-row: 2;
  grid-column: 5/5;

  font-size: 10px;
  width: auto;
  height: auto;
  min-width: 18px;
  min-height: 18px;
  border-radius: 10px;
  background-color: green;
  font-weight: bold;
  color: white;
  text-align: center;
  padding: 1px 2px 2px 1px;
}
#Chat-details > #Time,
#Chat-details > #Notification {
  justify-self: end;
}
#Chat-details > #DeliveryStatus {
  grid-row: 2;
  grid-column: 5/5;
  color: #1c39bb;
  font-weight: 600;
}
</style>
