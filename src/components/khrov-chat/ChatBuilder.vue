<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import ChatIcon from '@/components/khrov-chat/ChatIcon.vue';
  import ChatWindow from '@/components/khrov-chat/ChatWindow.vue';

  onMounted(() => {
    document.addEventListener("click", closeChatWindow, false);
  })
  onUnmounted(() => {
    document.removeEventListener("click", closeChatWindow, false);
  })

  const closeChatWindow = (e) => {
    const chatWindow = document.getElementById('ChatWindow-container');
    const chatIcon = document.getElementById('ChatIcon-container');

    // If chat window is open and a click occurred neither in the window or on chat icon
    if ( ! chatWindow.contains(e.target) && ! chatIcon.contains(e.target) ) {
      chatWindow.style["display"] = "none";
    }
  }

  const openChatWindow = () => {
    const chatWindow = document.getElementById('ChatWindow-container');
    chatWindow.style["display"] = "block";
  }


</script>

<template>
  <div id="ChatIcon-container" @click="openChatWindow" >
    <ChatIcon />
  </div>
  <div id="ChatWindow-container">
    <ChatWindow />
  </div>


</template>

<style scoped>
#ChatIcon-container {
  position: fixed;
  bottom: 15px;
  right: 15px;
  height: 60px;
  aspect-ratio: 1/1;
}

#ChatWindow-container {
  display: none;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 500px;
  z-index: 1;
  /* -webkit-transition: all 0.4s;
  transition: all 0.4s; */
}



</style>
