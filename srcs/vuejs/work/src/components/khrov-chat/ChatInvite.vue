<script setup lang="ts">
  import { ref, reactive, inject } from 'vue'
  import type { PropType } from 'vue'
  import ChatInviteItem from '@/components/khrov-chat/ChatInviteItem.vue';
  import ChatBlocked from '@/components/khrov-chat/ChatBlocked.vue';
  import type { ChatInvite, UserTb } from '@/components/khrov-chat/interface/khrov-chat';

  const props =  defineProps< {
    sTemp: number,
  } >()

  const $HOST = inject('$HOST');
  const $_: number = props.sTemp;
  const cInvite: ChatInvite = reactive({
    civContentOrNot: false,
    civSearchLoading: false, 
    civSearchInput: '',
    civLiFirstIsActive: true,
  });

  let datas: UserTb[];

  const searchUsers = (myId: number, key: string) => {

    cInvite.civContentOrNot = false;

    cInvite.civSearchLoading = true;
    if (key.length < 1) {
      cInvite.civSearchLoading = false;
      return ;
    }

    fetch(`${$HOST}/chats/get/search/user?searcherId=${myId}&key=${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
    })
    .then(response => {
      cInvite.civSearchLoading = false;
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(data => {
      datas = data;

      if ( data.length > 0) {
        cInvite.civContentOrNot = true; 
      }             
    })
    .catch(error => {});
  }

  const switchChiActive = (name: string) => {
    if (!name.match(/^first$|^second$/)) {
      return ;
    }
    cInvite.civLiFirstIsActive = name === 'first' ? true : false;
    cInvite.civLiFirstIsActive = name === 'second' ? false : true;
  }

</script>
<template>
  <div class="Chat-invite">
    <ul>
      <li :class="{'ChiActive': cInvite.civLiFirstIsActive}" @click="switchChiActive('first')">Find</li>
      <li :class="{'ChiActive': !cInvite.civLiFirstIsActive}" @click="switchChiActive('second')">Blocked</li>
    </ul>
    <div>
      <div class="Chi-find Chi-out" :class="{'ChiActive': cInvite.civLiFirstIsActive}"> 
        <input class="Search-box" 
          placeholder="Search user by *name"
          @keyup="searchUsers($_, cInvite.civSearchInput)"
          @keyup.enter="searchUsers($_, cInvite.civSearchInput)"
          v-model="cInvite.civSearchInput"
        />
        <div v-if="cInvite.civContentOrNot">
          <ChatInviteItem v-for='(item, index) in datas'
            :myId="$_"
            :theirId="item.id"
            :displayName="item.userName"
            :profileDp="item.profile_pics[0].avatar"
          />
        </div>
        <img v-if="cInvite.civSearchLoading"
          src="/khrov-chat-media/awaitingApi.gif" 
          alt="Searching" 
          class="Searching-invite"
        />
      </div>
      <div class="Chi-blocked Chi-out" :class="{'ChiActive': !cInvite.civLiFirstIsActive}">
        <ChatBlocked :sTemp="sTemp" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.Chat-invite {
  display: grid;
  grid-template-rows: 25px auto;

  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
}

.Chat-invite >ul:nth-child(1) {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.Chat-invite >ul:nth-child(1) > li {
  display: inline-block;
  background-color: #d7e1ec;
  position: relative;
  top: -1px;
  width: 50%;
  height: 99%;
  padding: 0;
  font-size: 14px;
  color: #009900;
  text-align: center;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  cursor: pointer;
}
.Chat-invite >:nth-child(1) > li:hover,
.Chat-invite >:nth-child(1) > li:active, 
.Chat-invite >:nth-child(1) > li.ChiActive {
  background-color: #F5F5DC;
}

.Chi-out {
  display: none;
}
.Chi-out.ChiActive {
  display: block; 
}

.Chat-invite >:nth-child(2) {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.Chat-invite >div:nth-child(2)::-webkit-scrollbar {
  display: none;
}

.Search-box {
  display: block;
  width: 90%;
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
.Search-box:focus, .Search-box:hover {
  box-shadow: 0 0 10px #73C2FB;
}

.Searching-invite {
  display: block;

  height: 90px;
  width: 120px;
  margin: 2px auto;
}

</style>
