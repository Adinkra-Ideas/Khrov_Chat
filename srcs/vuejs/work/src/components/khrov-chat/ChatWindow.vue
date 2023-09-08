<script setup lang="ts">
  import { reactive } from 'vue'
  import type { ChatWindow } from '@/components/khrov-chat/interface/khrov-chat';
  import ChatList from '@/components/khrov-chat/ChatList.vue'
  import ChatInvite from '@/components/khrov-chat/ChatInvite.vue';
  import ChatBlocked from '@/components/khrov-chat/ChatBlocked.vue';
  import ChannelNew from '@/components/khrov-chat/ChannelNew.vue';
  import ChannelList from '@/components/khrov-chat/ChannelList.vue';
  import type { PropType } from 'vue'

  const props =  defineProps< {
    sTemp: number,
  } >()

  const cWd: ChatWindow = reactive({
    chnList: 'Chats-tab',
  })

  const changeActiveTab = (class_name: string) => {
    if (!class_name.match(/^Chats-tab$|^Chatinv-tab$|^Channels-tab$|^ChannCreat-tab$/)) {
      return ;
    }
    cWd.chnList = class_name;
  }
</script>

<template>
  <div id="Window-container">
    <div>
      <ul id="Ul-tabs">
        <li class="Chats-tab Li-tabs" :class="{'cwActive': cWd.chnList=='Chats-tab'}" @click="changeActiveTab('Chats-tab')">Chats</li> <!-- For list of each user that has been chatted with -->
        <li class="Chatinv-tab Li-tabs" :class="{'cwActive': cWd.chnList=='Chatinv-tab'}" @click="changeActiveTab('Chatinv-tab')">Chat+</li> <!-- For inviting users to start chatting.  -->
        <li class="Channels-tab Li-tabs" :class="{'cwActive': cWd.chnList=='Channels-tab'}" @click="changeActiveTab('Channels-tab')">Channels</li> <!-- For list of channels user has participated/been invited -->
        <li class="ChannCreat-tab Li-tabs" :class="{'cwActive': cWd.chnList=='ChannCreat-tab'}" @click="changeActiveTab('ChannCreat-tab')">Channel+</li> <!-- For creating and inviting users -->
      </ul>
      <p class="Cwd-chat-count">+N</p>
      <p class="Cwd-channel-count">+N</p>
    </div> 
    <div id="Output-boxes">
      <div class="Chats-tab Output-box" :class="{'cwActive': cWd.chnList=='Chats-tab'}">
        <ChatList :sTemp="sTemp" />
      </div>
      <div class="Chatinv-tab Output-box" :class="{'cwActive': cWd.chnList=='Chatinv-tab'}">
        <ChatInvite :sTemp="sTemp" />
      </div>
      <div class="Channels-tab Output-box" :class="{'cwActive': cWd.chnList=='Channels-tab'}">
        <ChannelList :sTemp="sTemp" />
      </div>
      <div class="ChannCreat-tab Output-box" :class="{'cwActive': cWd.chnList=='ChannCreat-tab'}">
        <ChannelNew  :sTemp="sTemp" />
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
  background-color: #73C2FB;
  color: #fff;
  border-radius: 10px 10px 0 0;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.Li-tabs:hover, .Li-tabs:focus, .Li-tabs.cwActive {
  background-color: #1C39BB;
  box-shadow: -1px -2px 15px #73C2FB;
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
