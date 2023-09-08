<script setup lang="ts">
  import { ref, reactive, inject} from 'vue'
  import { onMounted, onUnmounted } from 'vue'
  import ChannelListItem from '@/components/khrov-chat/ChannelListItem.vue';
  import ChannelListItemMsg from '@/components/khrov-chat/ChannelListItemMsg.vue';
  import ChannelListItemPendings from '@/components/khrov-chat/ChannelListItemPendings.vue';
  import type { ChnListOfflineCache } from '@/components/khrov-chat/interface/khrov-chat'

  const props =  defineProps< {
    sTemp: number,
  } >()

  const $HOST = inject('$HOST');
  const $_: number = props.sTemp;
  const channCache: any = reactive({});  
  const offlineCache: ChnListOfflineCache[] = [];  

  interface ChnListPendingList {
    userId: number;
    chId: number;
    user: {
      userName: string;
    }
  }

  interface ChnListChannConn {
    chId: number;
    role: string;
    unreadCount: number;
    linkStatus: string;
    mutedUntil: string;
    ch: {
      name: string;
      desc: string;
      visibility: string;
    }
  }

  interface ChList {
    channConn: ChnListChannConn[]; 
    chlItemActive: boolean;      
    chlMsgsActive: boolean;     
    chlModActive: boolean;      
    chlVisibilityOfFocus: string;  
    chlIdOfFocus: number;     
    chlNameOfFocus: string;  
    chlDescOfFocus: string;  
    chlRoleOfFocus: string;  
    linkStatusOfFocus: string;  
    mutedUntilOfFocus: string; 
    chlMsgOrModerate: boolean;  
    chlMsgInput: string;      
    modGetUserIdArrowRotate: string; 
    modGetUserIdBoxDisplayToggle: string; 
    modMakeUserAdminArrowRotate: string; 
    modMakeUserAdminBoxDisplayToggle: string; 
    modModifyChannelArrowRotate: string; 
    modModifyChannelBoxDisplayToggle: string; 
    modPendingRequestsArrowRotate: string; 
    modPendingRequestsBoxDisplayToggle: string; 
    modGetUserIdInput: string;  
    notifMsg: string; 
    modModerMemberId: string;   
    modModerSelectAction: string; 
    modModerMuteMins: string; 
    notifModerMsg: string; 
    modModifySelectVisi: string;  
    modModifyPwd: string;   
    notifModifyMsg: string;   
    getPendingsObj: ChnListPendingList[];   
    getPendingsObjRef: number; 

  }

  const chList: ChList = reactive({
    channConn: [],
    chlItemActive: true,
    chlMsgsActive: false,
    chlModActive: false,
    chlVisibilityOfFocus: '',
    chlIdOfFocus: 0,
    chlNameOfFocus: '',
    chlDescOfFocus: '',
    chlRoleOfFocus: '',
    linkStatusOfFocus: '',
    mutedUntilOfFocus: '',
    chlMsgOrModerate: true,
    chlMsgInput: '',
    modGetUserIdArrowRotate: 'rotate(0deg)',
    modGetUserIdBoxDisplayToggle: '0px',
    modMakeUserAdminArrowRotate: 'rotate(0deg)',
    modMakeUserAdminBoxDisplayToggle: '0px',
    modModifyChannelArrowRotate: 'rotate(0deg)',
    modModifyChannelBoxDisplayToggle: '0px',
    modPendingRequestsArrowRotate: 'rotate(0deg)',
    modPendingRequestsBoxDisplayToggle: '0px',
    modGetUserIdInput: '',
    notifMsg: '',
    modModerMemberId: '',
    modModerSelectAction: '',
    modModerMuteMins: '',
    notifModerMsg: '',
    modModifySelectVisi: '',
    modModifyPwd: '',
    notifModifyMsg: '',
    getPendingsObj: [],
    getPendingsObjRef: 0,

  });

  const getChannelPreviews = () => {

    fetch(`${$HOST}/channels/get/connections/${$_}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept':'application/json'
        },
      })
    .then( (response) => { 
      if (!response.ok) {
        throw response;
      }
      return response.json() }) 
    .then( (data) => { 

      if (JSON.stringify(data) != JSON.stringify(chList.channConn)) {
        chList.channConn = data;
      }

      if (chList.chlIdOfFocus != 0) {
        getFocusedChannelHistory();
      }
    }) 
    .catch(error => {});
  }

  const getFocusedChannelHistory = () => {
    fetch(`${$HOST}/channels/get/connections/${$_}/${chList.chlIdOfFocus}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'application/json'
          },
        })
    .then(  (response) => { 
      if (!response.ok) {

        chList.chlIdOfFocus = 0;
        throw response;
      }
      return response.json() } )
    .then( (data) => { 

      if (!offlineCache.length && JSON.stringify(data) != JSON.stringify(channCache[chList.chlIdOfFocus])) {
        channCache[chList.chlIdOfFocus] = data;            
      };            
    }) 
    .catch( (error) => {} );
  }

  const submitChannMsg = () => {

    if (chList.chlMsgInput && chList.chlMsgInput.length == 0) {
      return ;
    }

    const offlineAppend = {
      'outgoing': chList.chlMsgInput as string,
      'createdAt': new Date().toISOString(),
      'deliveryStatus': 'pending',
      'user': {
        'userName': 'ME'
      }
    };
    channCache[chList.chlIdOfFocus] = [
      offlineAppend, ...channCache[chList.chlIdOfFocus]
    ];

    const tmp = {
      'userId': $_,
      'chId': chList.chlIdOfFocus,
      'msg': chList.chlMsgInput as string,
      'time': new Date().toISOString()
    }

    offlineCache.push(tmp);

    chList.chlMsgInput = '';

    fetch(`${$HOST}/channels/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(offlineCache),
    })
    .then( (responseMsg) => {

      if (responseMsg.ok) {
        offlineCache.length = 0;
      }
    });
  }

  const setSeen = (userId: number, chId: number) => {

    const tmp = {
      'userId': userId,
      'chId': chId
    }
    fetch(`${$HOST}/channels/put/set-seen`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
        },
      body: JSON.stringify(tmp),
    })
  }

  let intervalId: ReturnType<typeof setInterval>;
  onMounted(() => {
    intervalId = setInterval(getChannelPreviews, 2000);
  });
  onUnmounted(() => {
    clearInterval(intervalId);
  });

  const changeActiveBox = (name: string) => {

    if (!name.match(/^Chl-item$|^Chl-msgs$|^Chl-mod$/)){
      return ;
    }

    chList.chlItemActive = name==='Chl-item' ? true : false;
    chList.chlMsgsActive = name==='Chl-msgs' ? true : false;
    chList.chlModActive = name==='Chl-mod' ? true : false;
  }

  const visibilityToImage = (visibility: string): string => {
    if (!visibility.match(/^public$|^private$|^password$/)){
      return '';
    }
    let visImage: string = '/khrov-chat-media/Channel.png';
    if (visibility==='public') {
      return visImage.substring(0, 18) + 'public' + visImage.substring(18); 
    } else if (visibility==='private') {
      return visImage.substring(0, 18) + 'private' + visImage.substring(18); 
    } 
    return visImage.substring(0, 18) + 'password' + visImage.substring(18); 
  }

  const getUserID = (userNameInput: string) => {

    chList.notifMsg = '';

    if (!userNameInput || userNameInput.length < 3) {
      chList.notifMsg = 'Input in "userName" must be more than 3 chars'
      return ;
    }

    fetch(`${$HOST}/channels/?adminId=${$_}&chId=${chList.chlIdOfFocus}&userName=${userNameInput}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
    })
    .then(response => {
      if (response.ok) {

        chList.modGetUserIdInput = '';
        return response.json();
      }
    })
    .then(data => chList.notifMsg=data.message)
    .catch()
  }

  const moderateMembers = () => {

    chList.notifModerMsg = '';

    if (!parseInt(chList.modModerMemberId) || parseInt(chList.modModerMemberId) < 1) {
      chList.notifModerMsg = 'Input in "member Id" must be greater than 0'
      return ;
    }

    if (!chList.modModerSelectAction) {
      chList.notifModerMsg = 'Please select an option under "Select Action"'
      return ;
    }

    if (chList.modModerSelectAction==='mute'&& !chList.modModerMuteMins) {
      chList.notifModerMsg = 'Please enter number of minutes to mute'
      return ;
    }

    const muteTime = (parseInt(chList.modModerMuteMins)) ? parseInt(chList.modModerMuteMins) : 0;
    const currentTime = new Date() 
    const mutedUntil = new Date(currentTime.getTime() + 1000*60*muteTime);

    const tmp = {
      'adminId': $_,
      'chId': chList.chlIdOfFocus,
      'userId': parseInt(chList.modModerMemberId),
      'action': chList.modModerSelectAction,
      'mutedUntil': mutedUntil.toISOString()
    }

    fetch(`${$HOST}/channels/put/channel/moderate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(tmp),
    })
    .then(response => {
      if (response.ok) {

        chList.modModerMemberId = '';
        chList.modModerSelectAction = '';
        chList.modModerMuteMins = '';
        return response.json();
      }
    })
    .then(data => chList.notifModerMsg=data.message)
    .catch()
  }

  const modifyChannel = () => {

    chList.notifModifyMsg = '';

    if (!chList.modModifySelectVisi.match(/^public$|^private$|^password$/)) {
      chList.notifModifyMsg = 'Please Select a Channel Visibility Option!';
      return ;
    }
    if (chList.modModifySelectVisi==='password' &&
        !chList.modModifyPwd.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])^[a-zA-Z\d]{6,20}$/)) {
      chList.notifModifyMsg = 'Password must contain an Uppercase, Lowercase and Decimal. Length must be between 6 - 20 chars.';
      return ;
    }

    const passTmp = (chList.modModifySelectVisi==='password') ? chList.modModifyPwd : 'Abc123';

    const tmp = {
      'adminId': $_,
      'chId': chList.chlIdOfFocus,
      'newVisibility': chList.modModifySelectVisi,
      'password': passTmp,
    }

    fetch(`${$HOST}/channels/put/channel/moderate/modify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(tmp),
    })
    .then(response => {
      if (response.ok) {

        chList.modModifySelectVisi = '';
        chList.modModifyPwd = '';
        return response.json();
      }
    })
    .then(data => chList.notifModifyMsg=data.message)
    .catch() 
  }

  const getAllPending = () => {

    chList.getPendingsObj.length = 0;

    fetch(`${$HOST}/channels/get/channel/moderate/${$_}/${chList.chlIdOfFocus}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(data => {
      chList.getPendingsObj=data;

      chList.getPendingsObjRef += 1;
    })
    .catch() 
  }

  const approveOrReject = (choice: boolean, memberId: number) => {
    const tmp = {
      'adminId': $_,
      'chId': chList.chlIdOfFocus,
      'memberId': memberId,
      'action': choice,
    }
    fetch(`${$HOST}/channels/put/channel/moderate/pending/decide`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(tmp),
    })
    .then(response => {
      if (response.ok) {

        getAllPending();
      }
    })

  }

</script>

<template>
  <div class="Channel-list">
    <div class="Chl-item Chl-box" :class="{'ChlActive': chList.chlItemActive}" v-if="chList.channConn.length>0">
      <ChannelListItem v-for="(item, index) in chList.channConn"
        :channelId="item.chId"
        :role="item.role"
        :unread="item.unreadCount"
        :channelName="item.ch.name"
        :desc="item.ch.desc"
        :visibility="visibilityToImage(item.ch.visibility)"

        @click="{

            chList.chlVisibilityOfFocus = visibilityToImage(item.ch.visibility);

            chList.chlIdOfFocus = item.chId;

            chList.chlNameOfFocus = item.ch.name;

            chList.chlDescOfFocus = item.ch.desc;

            chList.chlRoleOfFocus = item.role;

            chList.linkStatusOfFocus = item.linkStatus;

            chList.mutedUntilOfFocus = item.mutedUntil;

            changeActiveBox('Chl-msgs');

            setSeen($_, chList.chlIdOfFocus);
          }"
      />
    </div>
    <div class="Chl-msgs Chl-box" :class="{'ChlActive': chList.chlMsgsActive}">
      <div class="Chl-msgs-header">
        <span @click="{

            changeActiveBox('Chl-item');

            chList.chlMsgOrModerate = true;

            setSeen($_, chList.chlIdOfFocus);
          }">&#11164;</span>
        <img :src="chList.chlVisibilityOfFocus" alt="Visibility" />
        <div>
          <p>{{chList.chlNameOfFocus}}</p>
          <p>{{chList.chlDescOfFocus}}</p>
        </div>  
        <img :src="chList.chlMsgOrModerate===true?'/khrov-chat-media/moderation.png':'/khrov-chat-media/messages.png'" alt="Moderate" v-if="chList.chlRoleOfFocus.match(/^owner$|^admin$/)"
          @click="{

              if (chList.chlMsgOrModerate===true) {
                chList.chlMsgOrModerate=false;
              } else {
                chList.chlMsgOrModerate=true;
              }
            }"
        />
      </div>
      <div class="Chl-msgs-body C-m-b-msgs" :class="{'CmbActive': chList.chlMsgOrModerate}">
        <!-- only create if the channelID exists as a cache in channelsCache  -->
        <!-- v-if the channelId of channel under focus already exists as a key in channCache -->
        <div class="Channel-messages" :key="channCache[chList.chlIdOfFocus]" v-if="chList.chlIdOfFocus in channCache" >
          <ChannelListItemMsg v-for="(item, index) in channCache[chList.chlIdOfFocus]"
            :name="item.user.userName"
            :msg="item.outgoing"
            :time="item.createdAt"
            :status="item.deliveryStatus"
          />  
        </div>
        <!-- rendered if it is channel owner or if the linkStatus not same as 'muted' -->
        <div class="New-channel-msg-input" v-if="chList.chlRoleOfFocus==='owner'||chList.linkStatusOfFocus!='muted'">
          <input type="text" class="Channel-msg-box" v-model="chList.chlMsgInput" @keyup.enter="submitChannMsg" />
          <span class="Channel-msg-send" @click="submitChannMsg">&#11166;</span>
        </div>
        <!-- rendered if user is muted and they are not channel owner -->
        <div class="New-channel-msg-input" v-if="chList.chlRoleOfFocus!='owner'&&chList.linkStatusOfFocus==='muted'">
          <button class="I-am-muted">
            <img src="/khrov-chat-media/muted.png" alt="Muted">
            <span>Until {{chList.mutedUntilOfFocus}} </span>
          </button>
        </div>
      </div>
      <div class="Chl-msgs-body C-m-b-moderate" :class="{'CmbActive': !chList.chlMsgOrModerate}">
        <div class="Channel-moderate">
          <button @click="{

                            if (chList.modGetUserIdArrowRotate==='rotate(0deg)') {
                              chList.modGetUserIdBoxDisplayToggle = '80px';
                              chList.modGetUserIdArrowRotate = 'rotate(90deg)';
                            } else {
                              chList.modGetUserIdBoxDisplayToggle = '0px';
                              chList.modGetUserIdArrowRotate = 'rotate(0deg)';
                            }
                          }">
            <svg fill="none" viewBox="0 0 16 16" width="12" height="12">
              <path fill="#000" fill-rule="evenodd" d="M5 2v12l6-6.001L5 2Z" clip-rule="evenodd">

              </path>
            </svg> Get User ID
          </button>
          <div>
            <input type="text" class="Chn-mod-get-id-input" 
              placeholder="Enter userName"
              v-model="chList.modGetUserIdInput"
              @keyup.enter="getUserID(chList.modGetUserIdInput)"
            />
            <p class="Chn-mod-get-id-msg" v-if="chList.notifMsg">{{chList.notifMsg}}</p>
          </div>

          <button @click="{

                            if (chList.modMakeUserAdminArrowRotate==='rotate(0deg)') {
                              chList.modMakeUserAdminBoxDisplayToggle = '150px';
                              chList.modMakeUserAdminArrowRotate = 'rotate(90deg)';
                            } else {
                              chList.modMakeUserAdminBoxDisplayToggle = '0px';
                              chList.modMakeUserAdminArrowRotate = 'rotate(0deg)';
                            }
                          }">
            <svg fill="none" viewBox="0 0 16 16" width="12" height="12">
              <path fill="#000" fill-rule="evenodd" d="M5 2v12l6-6.001L5 2Z" clip-rule="evenodd">

              </path>
            </svg> Moderate Members
          </button>
          <div>
            <input type="number" class="Chn-mod-moder-member-id" 
              placeholder="Enter member ID"
              v-model="chList.modModerMemberId"
            />
            <select v-model="chList.modModerSelectAction" class="Chn-mod-moder-select-action">
              <option disabled selected :value="''">Select Action</option>
              <option :value="'setAsAdmin'" v-if="chList.chlRoleOfFocus==='owner'">Assign Admin Role</option>
              <option :value="'ban'">Ban</option>
              <option :value="'kick'">Kick</option>
              <option :value="'mute'">Mute</option>
            </select>
            <input type="number" class="Chn-mod-moder-mute-mins" 
              v-if="chList.modModerSelectAction==='mute'"
              placeholder="Mute for N minutes"
              v-model="chList.modModerMuteMins"
            />
            <button class="Chn-mod-moder-submit" @click="moderateMembers()">Submit</button>
            <p class="Chn-mod-moder-msg" v-if="chList.notifModerMsg">{{chList.notifModerMsg}}</p>
          </div>

          <button v-show="chList.chlRoleOfFocus==='owner'" @click="{

                            if (chList.modModifyChannelArrowRotate==='rotate(0deg)') {
                              chList.modModifyChannelBoxDisplayToggle = '160px';
                              chList.modModifyChannelArrowRotate = 'rotate(90deg)';
                            } else {
                              chList.modModifyChannelBoxDisplayToggle = '0px';
                              chList.modModifyChannelArrowRotate = 'rotate(0deg)';
                            }
                          }">
            <svg fill="none" viewBox="0 0 16 16" width="12" height="12">
              <path fill="#000" fill-rule="evenodd" d="M5 2v12l6-6.001L5 2Z" clip-rule="evenodd">

              </path>
            </svg> Modify Channel
          </button>
          <div v-show="chList.chlRoleOfFocus==='owner'">
            <select v-model="chList.modModifySelectVisi" class="Chn-mod-modify-select-visi">
              <option disabled selected :value="''">Select Visibility</option>
              <option :value="'public'">Public</option>
              <option :value="'private'">Private</option>
              <option :value="'password'">Password</option>
            </select>
            <input type="text" class="Chn-mod-modify-password" 
              v-if="chList.modModifySelectVisi==='password'"
              placeholder="Set new password"
              v-model="chList.modModifyPwd"
            />
            <button class="Chn-mod-modify-submit" @click="modifyChannel()">Submit</button>
            <p class="Chn-mod-modify-msg" v-if="chList.notifModifyMsg">{{chList.notifModifyMsg}}</p>
          </div>

          <button @click="{

                            if (chList.modPendingRequestsArrowRotate==='rotate(0deg)') {
                              chList.modPendingRequestsBoxDisplayToggle = '150px';
                              chList.modPendingRequestsArrowRotate = 'rotate(90deg)';

                              getAllPending();
                            } else {
                              chList.modPendingRequestsBoxDisplayToggle = '0px';
                              chList.modPendingRequestsArrowRotate = 'rotate(0deg)';
                            }
                          }">
            <svg fill="none" viewBox="0 0 16 16" width="12" height="12">
              <path fill="#000" fill-rule="evenodd" d="M5 2v12l6-6.001L5 2Z" clip-rule="evenodd">

              </path>
            </svg> Pending Requests
          </button>
          <div>
            <div v-if="chList.getPendingsObj">
              <ChannelListItemPendings :key="chList.getPendingsObjRef" v-for="(item, index) in chList.getPendingsObj"
                :userId="item.userId"
                :userName="item.user.userName"
                :chId="item.chId"
                @to-approve="(choice) => approveOrReject(choice, item.userId)"
              />
              <p :key="chList.getPendingsObjRef" v-if="!chList.getPendingsObj.length">No pending member request</p>
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
  background-color: #F5F5DC;
}

.Chl-msgs-header >:nth-child(1) {
  font-size: 20px;
  color: #1C39BB;
  position: relative;
  top: 48%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  cursor: pointer;
}
.Chl-msgs-header >:nth-child(2) {
  width: 90%;
  height: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  margin: 0 auto;
}
.Chl-msgs-header >:nth-child(3) {
  width: 100%;
  margin-top: -3px;
}
.Chl-msgs-header >:nth-child(3) >:nth-child(1){
  display: block;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #1C39BB;
}
.Chl-msgs-header >:nth-child(3) >:nth-child(2){
  display: block;
  font-size: 10px;
  margin-top: -6px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-style: italic;
}
.Chl-msgs-header >:nth-child(4) {
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
  box-shadow: 0 0 5px #73C2FB;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Msg-box:focus, .Msg-box:hover {
  box-shadow: 0 0 10px #73C2FB;
}
.Channel-msg-send {
  display: inline-block;
  position: relative;
  top: 30%;
  transform: translateY(-70%);
  -ms-transform: translateY(-70%);
  font-size: 30px;
  color: #1C39BB;
  cursor: pointer;
}
.I-am-muted {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #73C2FB;
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
  box-shadow: 0 0 5px #73C2FB;
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
  background-color: #F5F5DC;
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
  box-shadow: 0 0 2px #73C2FB;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-get-id-input:focus, .Chn-mod-get-id-input:hover {
  box-shadow: 0 0 5px #73C2FB;
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
  background-color: #F5F5DC;
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
  box-shadow: 0 0 2px #73C2FB;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-moder-member-id:focus, .Chn-mod-moder-member-id:hover {
  box-shadow: 0 0 5px #73C2FB;
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
  box-shadow: 0 0 2px #73C2FB;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-moder-select-action:focus, .Chn-mod-moder-select-action:hover {
  box-shadow: 0 0 5px #73C2FB;
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
  box-shadow: 0 0 2px #73C2FB;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-moder-mute-mins:focus, .Chn-mod-moder-mute-mins:hover {
  box-shadow: 0 0 5px #73C2FB;
}
.Chn-mod-moder-submit {
  display: block;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 0 2px #73C2FB;
  -webkit-transition: 0.5s;
  transition: 0.5s;

}
.Chn-mod-moder-submit:focus, .Chn-mod-moder-submit:hover {
  box-shadow: 0 0 5px #73C2FB;
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
  background-color: #F5F5DC;
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
  box-shadow: 0 0 2px #73C2FB;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-modify-select-visi:focus, .Chn-mod-modify-select-visi:hover {
  box-shadow: 0 0 5px #73C2FB;
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
  box-shadow: 0 0 2px #73C2FB;
  outline: none;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.Chn-mod-modify-password:focus, .Chn-mod-modify-password:hover {
  box-shadow: 0 0 5px #73C2FB;
}
.Chn-mod-modify-submit {
  display: block;
  font-size: 10px;
  margin: 10px 0 5px 5px;
  border: none;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 0 2px #73C2FB;
  -webkit-transition: 0.5s;
  transition: 0.5s;

}
.Chn-mod-modify-submit:focus, .Chn-mod-modify-submit:hover {
  box-shadow: 0 0 5px #73C2FB;
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
  background-color: #F5F5DC;
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