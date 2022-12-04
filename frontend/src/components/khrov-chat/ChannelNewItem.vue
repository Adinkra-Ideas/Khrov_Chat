<script setup lang="ts">
import { useChannelNewItem } from '@/components/khrov-chat/composables/ChannelNewItem'

const props = defineProps<{
  channelId: number
  channelName: string
  desc: string
  visibility: string
  memberOr: string
}>()

const { cnItem, internal, changeMembership } = useChannelNewItem(props)
</script>
<template>
  <div class="Channel-new-item">
    <div class="Channel-preview">
      <img class="Visibility" :src="internal.visImage" alt="Visibility" />
      <div class="Chan-texts">
        <span class="Chan-name">{{ channelName }}</span>
        <span class="Channel-desc">{{ desc }}</span>
      </div>
      <div>
        <img
          class="Img-join Join-or-leave"
          :class="{ JlActive: !internal.partake }"
          src="/khrov-chat-media/joinGroup.png"
          alt="Ch-join"
          @click="
            {
              if (visibility != 'password' && cnItem.cniConfirmHeight == '0px') {
                cnItem.cniConfirmHeight = '20px';

                internal.joinExitFlag = true;
              } else if (visibility === 'password' && cnItem.cniPwdConfirmHeight == '0px') {
                cnItem.cniPwdConfirmHeight = '40px';

                internal.joinExitFlag = true;
              } else {
                cnItem.cniConfirmHeight = '0px';
                cnItem.cniPwdConfirmHeight = '0px';
              }
            }
          "
        />
        <img
          class="Img-leave Join-or-leave"
          :class="{ JlActive: internal.partake }"
          src="/khrov-chat-media/exitGroup.png"
          alt="Ch-exit"
          @click="
            {
              if (cnItem.cniConfirmHeight == '0px') {
                cnItem.cniConfirmHeight = '20px';

                internal.joinExitFlag = false;
              } else {
                cnItem.cniConfirmHeight = '0px';
              }
            }
          "
        />
      </div>
      <div class="Join-exit-confir">
        <button
          @click="
            {
              if (changeMembership(internal.joinExitFlag, channelId)) {
                $emit('joinOrExitComplete');
              }

              cnItem.cniConfirmHeight = '0px';
            }
          "
        >
          Yes
        </button>
        <button @click="cnItem.cniConfirmHeight = '0px'">No</button>
      </div>
      <div class="Password-confir">
        <input
          class="Password-box"
          placeholder="To join, enter password"
          v-model="cnItem.cniPwdInput"
          @keyup.enter="
            {
              if (cnItem.cniPwdInput.length > 0) {
                if (changeMembership(internal.joinExitFlag, channelId)) {
                  $emit('joinOrExitComplete');
                }
                cnItem.cniPwdConfirmHeight = '0px';
              }
            }
          "
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.Channel-new-item {
  position: relative;
}
.Channel-preview {
  display: grid;
  grid-template-columns: 0.5fr 6fr 1fr;
  grid-template-rows: 40px;
  width: 100%;
  height: 40px;
  padding: 0 5px;
  position: relative;
  background-color: rgb(245, 245, 245);
  margin: 2px 0;
  border-radius: 5px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.Channel-preview > * {
  padding: 2px;
  overflow: hidden;
}
.Channel-preview:hover {
  background-color: #f5f5dc;
}

.Visibility {
  position: relative;
  width: 25px;
  height: auto;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
}
.Chan-texts {
  display: block;
  position: relative;
  margin: 0 0 0 0;
}
.Chan-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
}
.Channel-desc {
  display: block;
  font-style: italic;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
}

.Ch-join,
.Ch-leave {
  position: relative;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 3px 5px;
  margin: 0 auto;
  font-size: 11px;
  font-weight: 500;
  width: max-content;
  height: max-content;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.Ch-join {
  background-color: #73c2fb;
}
.Ch-join:hover {
  background-color: #1c39bb;
}
.Ch-leave {
}
.Ch-leave:hover {
}

.Img-join,
.Img-leave {
  display: none;
  position: relative;
  width: 25px;
  height: auto;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  cursor: pointer;
  margin: 0 auto;
}
.Join-or-leave.JlActive {
  display: block;
}

.Join-exit-confir {
  padding: 0;
  display: block;
  width: 65px;
  height: v-bind('cnItem.cniConfirmHeight');
  overflow: hidden;
  position: absolute;
  bottom: -5px;
  right: 25px;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Join-exit-confir * {
  position: relative;
  top: -5px;
  left: -2px;
  display: inline-block;
  white-space: nowrap;
  font-size: 8px;
  margin: auto 0;
  padding: 3px 8px;
  border: none;
  color: white;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  border-radius: 0;
  box-shadow: none;
  cursor: pointer;
}
.Join-exit-confir > :nth-child(1) {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-left: 5px;
  background-color: #73c2fb;
  margin-right: 3px;
}
.Join-exit-confir > :nth-child(2) {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #1c39bb;
}
.Join-exit-confir > :nth-child(1):hover {
  box-shadow: 0 0 2px #73c2fb;
}
.Join-exit-confir > :nth-child(2):hover {
  box-shadow: 0 0 2px #1c39bb;
}

.Password-confir {
  display: block;
  width: 200px;
  height: v-bind('cnItem.cniPwdConfirmHeight');
  overflow: hidden;
  position: absolute;
  bottom: -5px;
  right: 25px;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Password-box {
  display: block;
  width: 180px;
  height: 15px;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  box-shadow: 0 0 5px #73c2fb;
  outline: none;
  margin: 5px;
  font-size: 10px;
}
</style>
