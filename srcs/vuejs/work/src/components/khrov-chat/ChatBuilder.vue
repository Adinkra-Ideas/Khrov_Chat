<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref, inject } from 'vue'
  import ChatIcon from '@/components/khrov-chat/ChatIcon.vue';
  import ChatWindow from '@/components/khrov-chat/ChatWindow.vue';
  import type { ChatBuilder } from '@/components/khrov-chat/interface/khrov-chat';
  import { layer } from '@layui/layer-vue';

  const $HOST = inject('$HOST');

  onMounted(() => {
    document.addEventListener("click", closeChatWindow, false);
  })
  onUnmounted(() => {
    document.removeEventListener("click", closeChatWindow, false);
  })

  const closeChatWindow = (e: Event) => {
    const chatWindow = document.getElementById('ChatWindow-container');
    const chatIcon = document.getElementById('ChatIcon-container');

    if (chatWindow && chatIcon) {

      if ( ! chatWindow.contains(e.target as Node) && ! chatIcon.contains(e.target as Node) ) {
        chatWindow.style["display"] = "none";
      }
    }
  }

  const openChatWindow = () => {
    const chatWindow = document.getElementById('ChatWindow-container');
    if (chatWindow) {
      chatWindow.style["display"] = "block";
    }
  }

  const initialTest: ChatBuilder = reactive({
    cbdFakeLogin: 'block',
  });

  const APItest = () => {
    if (initialTest.cbdUserInput && initialTest.cbdUserInput < 1) {
      return ;
    }

    fetch(`${$HOST}/chats/get/temp/login/${initialTest.cbdUserInput}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
    })
    .then(response => {
      if (!response.ok) {

        return response.json();
      }
      else {
        layer.msg('Success. Chat Interface Now Ready!');
        initialTest.cbdFakeLogin = 'none';
      }
    })
    .then(errorJson => {

      if (errorJson) {
        layer.msg(errorJson.message);
        console.log(errorJson.message);
      }
    })
  }
</script>

<template>
  <div class="Login-bg">
    <input class="APItest-box" 
        placeholder="Enter userId"
        v-model="initialTest.cbdUserInput"
        @keyup.enter="APItest"
    />
  </div>
  <div id="ChatIcon-container" @click="openChatWindow" >
    <ChatIcon />
  </div>
  <div id="ChatWindow-container" v-if="initialTest.cbdFakeLogin==='none'
    && initialTest.cbdUserInput">
    <ChatWindow :sTemp="parseInt(<string><unknown>initialTest.cbdUserInput)" />
  </div>
</template>

<style scoped>
.Login-bg {
  display: v-bind('initialTest.cbdFakeLogin');
  height: 200px;
  width: 200px;
  position: fixed;
  bottom: -75px;
  right: -75px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  box-shadow: 0 0 5px black;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Login-bg:hover {
  box-shadow: 0 0 15px black;
}
.APItest-box {
  display: v-bind('initialTest.cbdFakeLogin');
  position: fixed;
  bottom: 25px;
  right: 10px;
  width: 100px;
  height: 25px;
  margin: 5px auto;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  box-shadow: 0 0 5px #73C2FB;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.APItest-box:focus, .APItest-box:hover {
  box-shadow: 0 0 10px #73C2FB;
}

#ChatIcon-container {
  display: block;
  position: fixed;
  bottom: 15px;
  right: 15px;
  height: 60px;
  aspect-ratio: 1/1;
}

#ChatWindow-container {
  display: none;
  position: fixed;
  bottom: 5px;
  right: 5px;
  width: 300px;
  height: 500px;
  z-index: 1;

}

</style>
