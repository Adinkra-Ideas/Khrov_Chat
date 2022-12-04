<script setup lang="ts">
import ChatList from '@/components/khrov-chat/ChatList.vue'
import ChatInvite from '@/components/khrov-chat/ChatInvite.vue'
import ChannelNew from '@/components/khrov-chat/ChannelNew.vue'
import ChannelList from '@/components/khrov-chat/ChannelList.vue'
import { useChatsStore } from '@/stores/khrov-chat/chats'
import { useChatWindow } from '@/components/khrov-chat/composables/ChatWindow'

const chatsStore = useChatsStore()
const { cWd, changeActiveTab } = useChatWindow()
</script>
<template>
  <div id="Window-container">
    <div>
      <ul id="Ul-tabs">
        <li
          class="Chats-tab Li-tabs"
          :class="{ cwActive: cWd.chnList == 'Chats-tab' }"
          @click="{
                    changeActiveTab('Chats-tab');
                    chatsStore.manageAllNotifCounter(0, 0, 'chat');
                  }"
        >
          Chats
        </li>
        <!-- For list of each user that has been chatted with -->
        <li
          class="Chatinv-tab Li-tabs"
          :class="{ cwActive: cWd.chnList == 'Chatinv-tab' }"
          @click="changeActiveTab('Chatinv-tab')"
        >
          Chat+
        </li>
        <!-- For inviting users to start chatting.  -->
        <li
          class="Channels-tab Li-tabs"
          :class="{ cwActive: cWd.chnList == 'Channels-tab' }"
          @click="{
                    changeActiveTab('Channels-tab');
                    chatsStore.manageAllNotifCounter(0, 0, 'channel');
                  }"
        >
          Channels
        </li>
        <!-- For list of channels user has participated/been invited -->
        <li
          class="ChannCreat-tab Li-tabs"
          :class="{ cwActive: cWd.chnList == 'ChannCreat-tab' }"
          @click="changeActiveTab('ChannCreat-tab')"
        >
          Channel+
        </li>
        <!-- For creating and inviting users -->
      </ul>
      <p class="Cwd-chat-count" v-if="chatsStore.getChatNotifCnt">{{ (chatsStore.getChatNotifCnt <= 9) ? chatsStore.getChatNotifCnt : '>9'}}</p>
      <p class="Cwd-channel-count" v-if="chatsStore.getChannNotifCnt">{{ (chatsStore.getChannNotifCnt <= 9) ? chatsStore.getChannNotifCnt : '>9'}}</p>
    </div>
    <div id="Output-boxes">
      <div class="Chats-tab Output-box" :class="{ cwActive: cWd.chnList == 'Chats-tab' }">
        <ChatList />
      </div>
      <div class="Chatinv-tab Output-box" :class="{ cwActive: cWd.chnList == 'Chatinv-tab' }">
        <ChatInvite />
      </div>
      <div class="Channels-tab Output-box" :class="{ cwActive: cWd.chnList == 'Channels-tab' }">
        <ChannelList />
      </div>
      <div class="ChannCreat-tab Output-box" :class="{ cwActive: cWd.chnList == 'ChannCreat-tab' }">
        <ChannelNew />
      </div>
    </div>
  </div>
</template>

<style scoped>
#Window-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content auto;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding-top: 10px;
  border-radius: 10px 10px 0 0;
  background-image: linear-gradient(#d7e1ec 0%, #fff 74%);
  box-shadow: -1px -5px 10px #d7e1ec;
}
#Window-container > * {
  position: relative;
  padding: 5px;
  overflow: hidden;
}
#Window-container:hover {
  box-shadow: -1px -2px 25px #d7e1ec;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}

#Ul-tabs {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.Li-tabs {
  display: inline-block;
  padding: 2px 8px;
  margin: 2px;
  cursor: pointer;
  background-color: #73c2fb;
  color: #fff;
  border-radius: 10px 10px 0 0;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.Li-tabs:hover,
.Li-tabs:focus,
.Li-tabs.cwActive {
  background-color: #1c39bb;
  box-shadow: -1px -2px 15px #73c2fb;
}
.Li-tabs.Chats-tab {
  position: relative;
}

.Cwd-chat-count {
  position: absolute;
  left: 14%;
  top: 40%;
  transform: translateY(-70%);
  -ms-transform: translateY(-70%);
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: red;
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-align: center;
  padding: 0 2px 2px 0;
}
.Cwd-channel-count {
  position: absolute;
  left: 61%;
  top: 42%;
  transform: translateY(-70%);
  -ms-transform: translateY(-70%);
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: red;
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-align: center;
  padding: 0 2px 2px 0;
}

.Output-box {
  display: none;
  height: 100%;
  width: 100%;
  padding: 5px;
  background-color: rgb(245, 245, 245);
  position: relative;
  top: 0;
  left: 0;
  border-radius: 10px;
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
}
.Output-box::-webkit-scrollbar {
  display: none;
}

.Output-box.cwActive {
  display: block;
}
</style>
