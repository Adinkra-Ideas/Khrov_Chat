<script setup lang="ts">
  import { ref, reactive, inject } from 'vue'
  import type { PropType } from 'vue'
  import type { ChatInviteItem } from '@/components/khrov-chat/interface/khrov-chat';
  import { layer } from '@layui/layer-vue';
  const props =  defineProps< {
    myId: number,
    theirId: number,
    displayName: string,
    profileDp: string
  } >()

  const $HOST = inject('$HOST');

  const ciItem: ChatInviteItem = reactive({
    ciiBlockPanelHeight: '0px',
    ciiMsgPanelHeight: '0px',
    ciiMsgInput: '',
  });

  const sendNewMsg = () => {
    if (ciItem.ciiMsgInput.length < 1) {
      return ;
    }

    const tmp = {
      'senderId': props.myId,
      'receiverId': props.theirId,
      'msg': ciItem.ciiMsgInput,
    }

    fetch(`${$HOST}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(tmp),
    })
    .then(response => {
      if (!response.ok) {
        layer.msg('Message could not be sent');
        throw response;
      }

      ciItem.ciiMsgInput = '';

      ciItem.ciiMsgPanelHeight='0px';
      layer.msg('Message sent Successfully');
    })
  }

  const blockUser = (blocker: number, blocked: number, partner: string) => {
    const tmp = {
      'blockerId': blocker,
      'blockedId': blocked,
    }

    fetch(`${$HOST}/chats/block/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(tmp),
    })
    .then(response => {
      if (response.ok) {
        layer.msg(`You have blocked ${partner} successfully!`);
      } else {
        layer.msg(`Could not block ${partner}!`);
      }
    });
  }

</script>
<template>
  <div id="Chat-invite-item">
    <div class="User-preview">
      <img :src="profileDp" alt="Avatar" />
      <span>{{displayName}}</span>
      <img src="/khrov-chat-media/chat.png" alt="Message" @click="{

                                              ciItem.ciiBlockPanelHeight='0px';

                                              if (ciItem.ciiMsgPanelHeight==='0px'){
                                                ciItem.ciiMsgPanelHeight='25px';
                                              } else {
                                                ciItem.ciiMsgPanelHeight='0px';
                                              }
                                            }" />
      <img src="/khrov-chat-media/block.png" alt="Block" @click="{

                                              ciItem.ciiMsgPanelHeight='0px';

                                              if (ciItem.ciiBlockPanelHeight==='0px') {
                                                ciItem.ciiBlockPanelHeight='25px';
                                              } else {
                                                ciItem.ciiBlockPanelHeight='0px';
                                              }                                            
                                            }" />
    </div>
    <div class="Messaging-box-div">
      <input class="Messaging-box" v-model="ciItem.ciiMsgInput" @keyup.enter="sendNewMsg" />
    </div>
    <div class="Blocking-box-div">
      <button @click="{
        ciItem.ciiBlockPanelHeight='0px';
        blockUser(myId, theirId, displayName);
      }">Yes
      </button>
      <button @click="ciItem.ciiBlockPanelHeight='0px'" >No</button>
    </div>
  </div>
</template>
<style scoped>
#Chat-invite-item {
  position: relative;
}
.User-preview {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  grid-template-rows: 50px;
  width: 100%;
  height: 50px;
  padding: 5px;
  position: relative;
  background-color: rgb(245, 245, 245);
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.User-preview > * {
  padding: 5px;
}
.User-preview:hover {
  background-color: #F5F5DC;
}
.User-preview >:nth-child(1) {
  position: relative;
  top: 41%;
  transform: translateY(-50%);
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
}
.User-preview >:nth-child(2) {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  height: 100%;
  width: 100%;
  font-size: 16px;
  color: #1C39BB;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
}
.User-preview >:nth-child(3),
.User-preview >:nth-child(4) {
  position: relative;
  top: 40%;
  transform: translateY(-50%);
  height: 30px;
  aspect-ratio: 1/1;
  margin: 0 auto;
  cursor: pointer;
}

.Messaging-box-div {
  display: block;
  width: 110px;
  height: v-bind('ciItem.ciiMsgPanelHeight');
  overflow: hidden;
  position: absolute;
  bottom: -5px;
  right: 60px;

  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Messaging-box {
  display: block;
  width: 100px;
  height: 15px;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  box-shadow: 0 0 5px #73C2FB;
  outline: none;
  margin: 5px;
  font-size: 10px;
}

.Blocking-box-div {
  display: block;
  width: 60px;
  height: v-bind('ciItem.ciiBlockPanelHeight');
  overflow: hidden;
  position: absolute;
  bottom: -1px;
  right: 0;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Blocking-box-div * {
  display: inline-block;
  white-space: nowrap;
  font-size: 8px;
  margin: auto 0;
  padding: 3px 5px;
  border: none;
  color: white;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Blocking-box-div >:nth-child(1) {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-left: 5px;
  background-color: #73C2FB;
}
.Blocking-box-div >:nth-child(2) {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #1C39BB;
}
.Blocking-box-div >:nth-child(1):hover {
  box-shadow: 0 0 2px #73C2FB;
}
.Blocking-box-div >:nth-child(2):hover {
  box-shadow: 0 0 2px #1C39BB;
}
</style>
