<script setup lang="ts">
import { useChatListItemMsg } from '@/components/khrov-chat/composables/ChatListItemMsg'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

const props = defineProps<{
  incoming: string | null
  outgoing: string | null
  time: string
  status: string
  theirName: string
}>()

const { msgItem } = useChatListItemMsg(props)
const { trimDate } = useGlobal()
</script>
<template>
  <div>
    <div :class="msgItem.msiSentOrRcvd">
      <div>
        <div v-if="msgItem.msiMsg&&!msgItem.msiMsg.match(/^äiänäväiätäeä$|^ädäeäcäläiänäeä$|^äaäcäcäeäpätä$/)">
          {{ msgItem.msiMsg }}
        </div>
        <div class="Invite-options" v-if="outgoing&&outgoing.match(/^äiänäväiätäeä$/)">
          {{ `🗣️ you invited ${theirName} to a Game`}}
        </div>
        <div class="Invite-options" v-if="outgoing&&outgoing.match(/^ädäeäcäläiänäeä$/)">
          {{ `❌ ${theirName} declined your Game Invite`}}
        </div>
        <div class="Invite-options" v-if="outgoing&&outgoing.match(/^äaäcäcäeäpätä$/)">
          {{ `✅ ${theirName} accepted your Invite. Message them to setup Game`}}
        </div>
        <div class="Accept-reject-invite" v-if="incoming&&incoming.match(/^äiänäväiätäeä$/)">
          <div class="Invite-options">
            {{ `🗣️ ${theirName} invited you to a Game`}}
          </div>
          <button class="Confirm-accept" @click="$emit('myDecision', 'äaäcäcäeäpätä')">Accept
          </button>
          <button class="Confirm-reject" @click="$emit('myDecision', 'ädäeäcäläiänäeä')">Reject
          </button>
        </div>
        <div class="Invite-options" v-if="incoming&&incoming.match(/^ädäeäcäläiänäeä$/)">
          {{ `❌ you declined ${theirName}'s Game Invite`}}
        </div>
        <div class="Invite-options" v-if="incoming&&incoming.match(/^äaäcäcäeäpätä$/)">
          {{ `✅ you accepted ${theirName}'s Invite'. Message them to setup Game`}}
        </div>
      </div> 
      <span class="Time-status-container" :class="{ AlignTimeRight: msgItem.msiTimeAlign }">
        {{ trimDate(time) }} <span class="Status-mark" v-if="!incoming">{{ msgItem.msiStatusOut }}</span>
      </span>
    </div>
    <p :class="msgItem.msiClearFloat"></p>
  </div>
</template>
<style scoped>
.Sent {
  display: block;
  position: relative;
  float: right;
  margin: 5px 0 5px 20%;
  padding: 2px 5px;
  border-style: solid;
  border-width: 2px;
  border-color: #c6f9d9;
  border-radius: 5px;
  background-color: #d4f7e1;
  overflow-wrap: break-word;
}
.Clear-right {
  clear: right;
}
.Received {
  display: block;
  position: relative;
  float: left;
  margin: 5px 20% 5px 0;
  padding: 2px 5px;
  border-style: solid;
  border-width: 2px;
  border-color: #fff;
  border-radius: 5px;
  background-color: #f5f5dc;
  word-break: break-word;
}
.Clear-left {
  clear: left;
}

.Time-status-container {
  display: block;
  white-space: nowrap;
  position: absolute;
  bottom: -8px;
  font-size: 8px;
  font-weight: 400;
  color: black;
  padding-left: 5px;
  background-color: inherit;
  border-radius: 5px;
}
.AlignTimeRight {
  right: 0;
}
.Status-mark {
  color: #1c39bb;
  font-weight: 600;
}

.Invite-options {
  color: blue;
  font-size: 10px;
  font-style: italic;
  width: 200px;
  min-height: 40px;
}

.Accept-reject-invite {
  width: 200px;
}
button.Confirm-accept, button.Confirm-reject {
  display: inline-block;
  position: relative;
  border: none;
  padding: 5px;
  color: white;
  width: 47%;
  margin-left: 2%;
  font-size: 13px;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: none;
}
button.Confirm-accept {
  background-color: #32de84;
}
button.Confirm-reject {
  background-color: #C34A2C;
}
button.Confirm-accept:hover {
  box-shadow: 0 0 2px #32de84;
}
button.Confirm-reject:hover {
  box-shadow: 0 0 2px #C34A2C;
}
</style>
