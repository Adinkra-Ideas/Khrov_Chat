<script setup lang="ts">
import ChatInviteItem from '@/components/khrov-chat/ChatInviteItem.vue'
import ChatBlocked from '@/components/khrov-chat/ChatBlocked.vue'
import { useChatInvite } from '@/components/khrov-chat/composables/ChatInvite'

const { cInvite, searchUsers, switchChiActive } = useChatInvite()
</script>
<template>
  <div class="Chat-invite">
    <ul>
      <li :class="{ ChiActive: cInvite.civLiFirstIsActive }" @click="switchChiActive('first')">
        Find
      </li>
      <li :class="{ ChiActive: !cInvite.civLiFirstIsActive }" @click="switchChiActive('second')">
        Blocked
      </li>
    </ul>
    <div>
      <div class="Chi-find Chi-out" :class="{ ChiActive: cInvite.civLiFirstIsActive }">
        <input
          class="Search-box"
          placeholder="Search user by *name"
          @keyup="searchUsers(cInvite.civSearchInput)"
          @keyup.enter="searchUsers(cInvite.civSearchInput)"
          v-model="cInvite.civSearchInput"
        />
        <div v-if="cInvite.civContentOrNot">
          <ChatInviteItem
            v-for="item in cInvite.datas"
            v-bind:key="item.id"
            :theirId="item.id"
            :displayName="item.userName"
            :profileDp="item.profile_pics[0].avatar"
          />
        </div>
        <img
          v-if="cInvite.civSearchLoading"
          src="/khrov-chat-media/awaitingApi.gif"
          alt="Searching"
          class="Searching-invite"
        />
      </div>
      <div class="Chi-blocked Chi-out" :class="{ ChiActive: !cInvite.civLiFirstIsActive }">
        <ChatBlocked />
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

.Chat-invite > ul:nth-child(1) {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.Chat-invite > ul:nth-child(1) > li {
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
.Chat-invite > :nth-child(1) > li:hover,
.Chat-invite > :nth-child(1) > li:active,
.Chat-invite > :nth-child(1) > li.ChiActive {
  background-color: #f5f5dc;
}

.Chi-out {
  display: none;
}
.Chi-out.ChiActive {
  display: block;
}

.Chat-invite > :nth-child(2) {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.Chat-invite > div:nth-child(2)::-webkit-scrollbar {
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
  box-shadow: 0 0 5px #73c2fb;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Search-box:focus,
.Search-box:hover {
  box-shadow: 0 0 10px #73c2fb;
}

.Searching-invite {
  display: block;

  height: 90px;
  width: 120px;
  margin: 2px auto;
}
</style>
