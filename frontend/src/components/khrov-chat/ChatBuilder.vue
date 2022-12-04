<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import ChatIcon from '@/components/khrov-chat/ChatIcon.vue'
import ChatWindow from '@/components/khrov-chat/ChatWindow.vue'
import { useChatsStore } from '@/stores/khrov-chat/chats'
import { useChatBuilder } from '@/components/khrov-chat/composables/ChatBuilder'

const chatsStore = useChatsStore();
const authStore = useAuthStore();
const { startChat, openChatWindow } = useChatBuilder()
</script>

<template>
  <div v-if="authStore.getLoginStatus">
    <div id="ChatIcon-container" @click="{
                                            if (startChat) {
                                              openChatWindow();
                                              chatsStore.manageAllNotifCounter(0, 0, 'icon');
                                            }
                                            startChat=1;  
                                          }"
    >
      <ChatIcon />
    </div>
    <div id="ChatWindow-container" v-if="startChat">
      <ChatWindow />
    </div>
  </div>
</template>

<style scoped>
#ChatIcon-container {
  display: block;
  position: fixed;
  bottom: 85px;
  right: 15px;
  height: 60px;
  z-index: 1;
  aspect-ratio: 1/1;
}

#ChatWindow-container {
  display: none;
  position: fixed;
  bottom: 5px;
  right: 5px;
  width: 300px;
  height: 500px;
  z-index: 2;
  text-align: start;
}
</style>
