<script setup lang="ts">
import ChannelListItem from '@/components/khrov-chat/ChannelListItem.vue'
import ChannelListItemMsg from '@/components/khrov-chat/ChannelListItemMsg.vue'
import ChannelListItemPendings from '@/components/khrov-chat/ChannelListItemPendings.vue'
import { useChatsStore } from '@/stores/khrov-chat/chats'
import { useChannelList } from '@/components/khrov-chat/composables/ChannelList'

const chatsStore = useChatsStore()
const { 
    chList, 
    channCache, 
    calculateChannNotif,
    submitChannMsg,
    setSeen,
    changeActiveBox,
    visibilityToImage,
    getUserID,
    moderateMembers,
    modifyChannel,
    getAllPending,
    approveOrReject
  } = useChannelList()
</script>

<template>
  <div class="Channel-list">
    <p class="Empty-channel-list" v-if="chList.channConn.length===0">
      No Channel Conversations to display!
    </p>
    <div
      class="Chl-item Chl-box"
      :class="{ ChlActive: chList.chlItemActive }"
      v-if="chList.channConn.length > 0"
    >
      <ChannelListItem
        v-for="item in chList.channConn"
        v-bind:key="item.chId"
        :channelId="item.chId"
        :role="item.role"
        :unread="item.unreadCount"
        :channelName="item.ch.name"
        :desc="item.ch.desc"
        :visibility="visibilityToImage(item.ch.visibility)"
        @click="
          {
            chList.chlVisibilityOfFocus = visibilityToImage(item.ch.visibility);

            chList.chlIdOfFocus = item.chId;

            chList.chlNameOfFocus = item.ch.name;

            chList.chlDescOfFocus = item.ch.desc;

            chList.chlRoleOfFocus = item.role;

            chList.linkStatusOfFocus = item.linkStatus;

            chList.mutedUntilOfFocus = item.mutedUntil;

            changeActiveBox('Chl-msgs');

            calculateChannNotif();
            setSeen(chList.chlIdOfFocus);
            chatsStore.manageAllNotifCounter(0, 0, 'channel');

          }"
      />
    </div>
    <div class="Chl-msgs Chl-box" :class="{ ChlActive: chList.chlMsgsActive }">
      <div class="Chl-msgs-header">
        <span
          @click="{
              changeActiveBox('Chl-item');

              chList.chlMsgOrModerate = true;

              setSeen(chList.chlIdOfFocus);
            }
          "
          >&#11164;</span
        >
        <img :src="chList.chlVisibilityOfFocus" alt="Visibility" />
        <div>
          <p>{{ chList.chlNameOfFocus }}</p>
          <p>{{ chList.chlDescOfFocus }}</p>
        </div>
        <img
          :src="
            chList.chlMsgOrModerate === true
              ? '/khrov-chat-media/moderation.png'
              : '/khrov-chat-media/messages.png'
          "
          alt="Moderate"
          v-if="chList.chlRoleOfFocus.match(/^owner$|^admin$/)"
          @click="{
              if (chList.chlMsgOrModerate === true) {
                chList.chlMsgOrModerate = false;
              } else {
                chList.chlMsgOrModerate = true;
              }
            }"
        />
      </div>
      <div class="Chl-msgs-body C-m-b-msgs" :class="{ CmbActive: chList.chlMsgOrModerate }">
        <!-- only create if the channelID exists as a cache in channelsCache  -->
        <!-- v-if the channelId of channel under focus already exists as a key in channCache -->
        <div
          class="Channel-messages"
          :key="channCache[chList.chlIdOfFocus]"
          v-if="chList.chlIdOfFocus in channCache"
        >
          <ChannelListItemMsg
            v-for="item in channCache[chList.chlIdOfFocus]"
            v-bind:key="item"
            :name="item.user.userName"
            :msg="item.outgoing"
            :time="item.createdAt"
            :status="item.deliveryStatus"
          />
        </div>
        <!-- rendered if it is channel owner or if the linkStatus not same as 'muted' -->
        <div
          class="New-channel-msg-input"
          v-if="chList.chlRoleOfFocus === 'owner' || chList.linkStatusOfFocus != 'muted'"
        >
          <input
            type="text"
            class="Channel-msg-box"
            v-model="chList.chlMsgInput"
            @keyup.enter="submitChannMsg"
          />
          <span class="Channel-msg-send" @click="submitChannMsg">&#11166;</span>
        </div>
        <!-- rendered if user is muted and they are not channel owner -->
        <div
          class="New-channel-msg-input"
          v-if="chList.chlRoleOfFocus != 'owner' && chList.linkStatusOfFocus === 'muted'"
        >
          <button class="I-am-muted">
            <img src="/khrov-chat-media/muted.png" alt="Muted" />
            <span>Until {{ chList.mutedUntilOfFocus }} </span>
          </button>
        </div>
      </div>
      <div class="Chl-msgs-body C-m-b-moderate" :class="{ CmbActive: !chList.chlMsgOrModerate }">
        <div class="Channel-moderate">
          <button
            @click="
              {
                if (chList.modGetUserIdArrowRotate === 'rotate(0deg)') {
                  chList.modGetUserIdBoxDisplayToggle = '80px';
                  chList.modGetUserIdArrowRotate = 'rotate(90deg)';
                } else {
                  chList.modGetUserIdBoxDisplayToggle = '0px';
                  chList.modGetUserIdArrowRotate = 'rotate(0deg)';
                }
              }
            "
          >
            <svg fill="none" viewBox="0 0 16 16" width="12" height="12">
              <path
                fill="#000"
                fill-rule="evenodd"
                d="M5 2v12l6-6.001L5 2Z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Get User ID
          </button>
          <div>
            <input
              type="text"
              class="Chn-mod-get-id-input"
              placeholder="Enter userName"
              v-model="chList.modGetUserIdInput"
              @keyup.enter="getUserID(chList.modGetUserIdInput)"
            />
            <p class="Chn-mod-get-id-msg" v-if="chList.notifMsg">{{ chList.notifMsg }}</p>
          </div>

          <button
            @click=";
              {
                if (chList.modMakeUserAdminArrowRotate === 'rotate(0deg)') {
                  chList.modMakeUserAdminBoxDisplayToggle = '150px';
                  chList.modMakeUserAdminArrowRotate = 'rotate(90deg)';
                } else {
                  chList.modMakeUserAdminBoxDisplayToggle = '0px';
                  chList.modMakeUserAdminArrowRotate = 'rotate(0deg)';
                }
              }
            "
          >
            <svg fill="none" viewBox="0 0 16 16" width="12" height="12">
              <path
                fill="#000"
                fill-rule="evenodd"
                d="M5 2v12l6-6.001L5 2Z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Moderate Members
          </button>
          <div>
            <input
              type="number"
              class="Chn-mod-moder-member-id"
              placeholder="Enter member ID"
              v-model="chList.modModerMemberId"
            />
            <select v-model="chList.modModerSelectAction" class="Chn-mod-moder-select-action">
              <option disabled selected :value="''">Select Action</option>
              <option :value="'setAsAdmin'" v-if="chList.chlRoleOfFocus === 'owner'">
                Assign Admin Role
              </option>
              <option :value="'ban'">Ban</option>
              <option :value="'kick'">Kick</option>
              <option :value="'mute'">Mute</option>
            </select>
            <input
              type="number"
              class="Chn-mod-moder-mute-mins"
              v-if="chList.modModerSelectAction === 'mute'"
              placeholder="Mute for N minutes"
              v-model="chList.modModerMuteMins"
            />
            <button class="Chn-mod-moder-submit" @click="moderateMembers()">Submit</button>
            <p class="Chn-mod-moder-msg" v-if="chList.notifModerMsg">{{ chList.notifModerMsg }}</p>
          </div>

          <button
            v-show="chList.chlRoleOfFocus === 'owner'"
            @click="
              {
                if (chList.modModifyChannelArrowRotate === 'rotate(0deg)') {
                  chList.modModifyChannelBoxDisplayToggle = '160px';
                  chList.modModifyChannelArrowRotate = 'rotate(90deg)';
                } else {
                  chList.modModifyChannelBoxDisplayToggle = '0px';
                  chList.modModifyChannelArrowRotate = 'rotate(0deg)';
                }
              }
            "
          >
            <svg fill="none" viewBox="0 0 16 16" width="12" height="12">
              <path
                fill="#000"
                fill-rule="evenodd"
                d="M5 2v12l6-6.001L5 2Z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Modify Channel
          </button>
          <div v-show="chList.chlRoleOfFocus === 'owner'">
            <select v-model="chList.modModifySelectVisi" class="Chn-mod-modify-select-visi">
              <option disabled selected :value="''">Select Visibility</option>
              <option :value="'public'">Public</option>
              <option :value="'private'">Private</option>
              <option :value="'password'">Password</option>
            </select>
            <input
              type="text"
              class="Chn-mod-modify-password"
              v-if="chList.modModifySelectVisi === 'password'"
              placeholder="Set new password"
              v-model="chList.modModifyPwd"
            />
            <button class="Chn-mod-modify-submit" @click="modifyChannel()">Submit</button>
            <p class="Chn-mod-modify-msg" v-if="chList.notifModifyMsg">
              {{ chList.notifModifyMsg }}
            </p>
          </div>

          <button
            @click="
              {
                if (chList.modPendingRequestsArrowRotate === 'rotate(0deg)') {
                  chList.modPendingRequestsBoxDisplayToggle = '150px';
                  chList.modPendingRequestsArrowRotate = 'rotate(90deg)';

                  getAllPending();
                } else {
                  chList.modPendingRequestsBoxDisplayToggle = '0px';
                  chList.modPendingRequestsArrowRotate = 'rotate(0deg)';
                }
              }
            "
          >
            <svg fill="none" viewBox="0 0 16 16" width="12" height="12">
              <path
                fill="#000"
                fill-rule="evenodd"
                d="M5 2v12l6-6.001L5 2Z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Pending Requests
          </button>
          <div>
            <div v-if="chList.getPendingsObj" :key="chList.getPendingsObjRef">
              <ChannelListItemPendings
                v-for="item in chList.getPendingsObj"
                v-bind:key="item.userId"
                :userId="item.userId"
                :userName="item.user.userName"
                :chId="item.chId"
                @to-approve="(choice) => approveOrReject(choice, item.userId)"
              />
              <p :key="chList.getPendingsObjRef" v-if="!chList.getPendingsObj.length">
                No pending member request
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Channel-list {
  display: block;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.Channel-list::-webkit-scrollbar {
  display: none;
}

.Empty-channel-list {
  text-align: center;
  padding-top: 10px;
  color: #009900;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.Chl-box {
  display: none;
}
.Chl-box.ChlActive {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
}

.Chl-msgs-header {
  display: grid;
  grid-template-columns: 0.5fr 0.75fr 5fr max-content;
  grid-template-rows: 35px;
  width: 100%;
  height: 35px;
  padding: 0 5px;
  position: relative;
  background-color: #eeeefc;
  margin: 2px 0;
  border-radius: 5px;
}
.Chl-msgs-header > * {
  padding: 2px;
  overflow: hidden;
}
.Chl-msgs-header:hover {
  background-color: #f5f5dc;
}

.Chl-msgs-header > :nth-child(1) {
  font-size: 20px;
  color: #1c39bb;
  position: relative;
  top: 48%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  cursor: pointer;
}
.Chl-msgs-header > :nth-child(2) {
  width: 90%;
  height: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  margin: 0 auto;
}
.Chl-msgs-header > :nth-child(3) {
  width: 100%;
  margin-top: -3px;
}
.Chl-msgs-header > :nth-child(3) > :nth-child(1) {
  display: block;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #1c39bb;
}
.Chl-msgs-header > :nth-child(3) > :nth-child(2) {
  display: block;
  font-size: 10px;
  margin-top: -6px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-style: italic;
}
.Chl-msgs-header > :nth-child(4) {
  width: 20px;
  height: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  margin: 0 auto;
  cursor: pointer;
}

.Chl-msgs-body {
  display: none;
}
.Chl-msgs-body.CmbActive {
  display: block;
  width: 100%;
  height: calc(100% - 35px);
  position: relative;
  bottom: 0;
}

.Channel-messages {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  height: 315px;
  overflow-y: scroll;
  border-radius: 10px;

  -ms-overflow-style: none;
  scrollbar-width: none;
}

.Channel-messages::-webkit-scrollbar {
  display: none;
}
.New-channel-msg-input {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;

  display: grid;
  grid-template-columns: auto max-content;
  grid-template-rows: 35px;
  padding: 5px 2px 0 0;
}
.Channel-msg-box {
  width: 90%;
  height: 25px;
  margin: 0 auto;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  box-shadow: 0 0 5px #73c2fb;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Msg-box:focus,
.Msg-box:hover {
  box-shadow: 0 0 10px #73c2fb;
}
.Channel-msg-send {
  display: inline-block;
  position: relative;
  top: 30%;
  transform: translateY(-70%);
  -ms-transform: translateY(-70%);
  font-size: 30px;
  color: #1c39bb;
  cursor: pointer;
}
.I-am-muted {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #73c2fb;
  color: white;
  width: max-content;
  height: 35px;
  font-size: 14px;
  border-radius: 10px;
  border: none;
  padding-right: 15px;
  position: relative;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -0);
  -ms-transform: translate(-50%, -0);
  box-shadow: 0 0 5px #73c2fb;
}
.I-am-muted > img {
  height: 20px;
  margin-right: 10px;
}

.Channel-moderate {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  overflow-y: scroll;
  border-radius: 10px;

  -ms-overflow-style: none;
  scrollbar-width: none;
}

.Channel-moderate::-webkit-scrollbar {
  display: none;
}

.Channel-moderate > button:nth-child(1) {
  display: block;
  width: 100%;
  height: 30px;
  border: none;
  margin-top: 1px;
  background-color: #e9e9f9;
  padding: 5px 2px;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > button:nth-child(1):hover {
  background-color: #eeeefc;
}
.Channel-moderate > button:nth-child(1) > svg {
  transform: v-bind('chList.modGetUserIdArrowRotate');
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > div:nth-child(2) {
  display: block;
  width: 100%;
  height: v-bind('chList.modGetUserIdBoxDisplayToggle');
  overflow: hidden;
  border: none;
  padding: 0 5px;
  background-color: #f5f5dc;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Chn-mod-get-id-input {
  width: 70%;
  height: 15px;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding-left: 10px;
  box-shadow: 0 0 2px #73c2fb;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-get-id-input:focus,
.Chn-mod-get-id-input:hover {
  box-shadow: 0 0 5px #73c2fb;
}
.Chn-mod-get-id-msg {
  margin: 0 5px 5px;
  font-size: 12px;
  font-weight: 500;
}

.Channel-moderate > button:nth-child(3) {
  display: block;
  width: 100%;
  height: 30px;
  border: none;
  margin-top: 1px;
  background-color: #e9e9f9;
  padding: 5px 2px;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > button:nth-child(3):hover {
  background-color: #eeeefc;
}
.Channel-moderate > button:nth-child(3) > svg {
  transform: v-bind('chList.modMakeUserAdminArrowRotate');
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > div:nth-child(4) {
  display: block;
  width: 100%;
  height: v-bind('chList.modMakeUserAdminBoxDisplayToggle');
  overflow: hidden;
  border: none;
  padding: 0 5px;
  background-color: #f5f5dc;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Chn-mod-moder-member-id {
  display: block;
  width: 70%;
  height: 15px;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding-left: 10px;
  box-shadow: 0 0 2px #73c2fb;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-moder-member-id:focus,
.Chn-mod-moder-member-id:hover {
  box-shadow: 0 0 5px #73c2fb;
}
.Chn-mod-moder-select-action {
  display: block;
  width: 70%;
  height: 15px;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding-left: 10px;
  box-shadow: 0 0 2px #73c2fb;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-moder-select-action:focus,
.Chn-mod-moder-select-action:hover {
  box-shadow: 0 0 5px #73c2fb;
}
.Chn-mod-moder-mute-mins {
  display: block;
  width: 70%;
  height: 15px;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding-left: 10px;
  box-shadow: 0 0 2px #73c2fb;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-moder-mute-mins:focus,
.Chn-mod-moder-mute-mins:hover {
  box-shadow: 0 0 5px #73c2fb;
}
.Chn-mod-moder-submit {
  display: block;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 0 2px #73c2fb;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.Chn-mod-moder-submit:focus,
.Chn-mod-moder-submit:hover {
  box-shadow: 0 0 5px #73c2fb;
}
.Chn-mod-moder-msg {
  margin: 0 5px 5px;
  font-size: 12px;
  font-weight: 500;
}

.Channel-moderate > button:nth-child(5) {
  display: block;
  width: 100%;
  height: 30px;
  border: none;
  margin-top: 1px;
  background-color: #e9e9f9;
  padding: 5px 2px;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > button:nth-child(5):hover {
  background-color: #eeeefc;
}
.Channel-moderate > button:nth-child(5) > svg {
  transform: v-bind('chList.modModifyChannelArrowRotate');
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > div:nth-child(6) {
  display: block;
  width: 100%;
  height: v-bind('chList.modModifyChannelBoxDisplayToggle');
  overflow: hidden;
  border: none;
  padding: 0 5px;
  background-color: #f5f5dc;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Chn-mod-modify-select-visi {
  display: block;
  width: 70%;
  height: 15px;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding-left: 10px;
  box-shadow: 0 0 2px #73c2fb;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-modify-select-visi:focus,
.Chn-mod-modify-select-visi:hover {
  box-shadow: 0 0 5px #73c2fb;
}
.Chn-mod-modify-password {
  display: block;
  width: 70%;
  height: 15px;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding-left: 10px;
  box-shadow: 0 0 2px #73c2fb;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-modify-password:focus,
.Chn-mod-modify-password:hover {
  box-shadow: 0 0 5px #73c2fb;
}
.Chn-mod-modify-submit {
  display: block;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 0 2px #73c2fb;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.Chn-mod-modify-submit:focus,
.Chn-mod-modify-submit:hover {
  box-shadow: 0 0 5px #73c2fb;
}
.Chn-mod-modify-msg {
  margin: 0 5px 5px;
  font-size: 12px;
  font-weight: 500;
}

.Channel-moderate > button:nth-child(7) {
  display: block;
  width: 100%;
  height: 30px;
  border: none;
  margin-top: 1px;
  background-color: #e9e9f9;
  padding: 5px 2px;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > button:nth-child(7):hover {
  background-color: #eeeefc;
}
.Channel-moderate > button:nth-child(7) > svg {
  transform: v-bind('chList.modPendingRequestsArrowRotate');
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > div:nth-child(8) {
  display: block;
  width: 100%;
  height: v-bind('chList.modPendingRequestsBoxDisplayToggle');
  overflow: hidden;
  border: none;
  background-color: #f5f5dc;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.Channel-moderate > div:nth-child(8) > div:nth-child(1) {
  display: block;
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.Channel-moderate > div:nth-child(8) > div:nth-child(1)::-webkit-scrollbar {
  display: none;
}
</style>
