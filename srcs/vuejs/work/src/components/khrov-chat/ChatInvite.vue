<script setup lang="ts">
  import { ref, reactive, inject } from 'vue'
  import type { PropType } from 'vue'
  import ChatInviteItem from '@/components/khrov-chat/ChatInviteItem.vue';
  import type { ChatInvite, UserTb } from '@/components/khrov-chat/interface/khrov-chat';

  const props =  defineProps< {
    sTemp: number,
  } >()

  const $HOST = inject('$HOST');
  const $_: number = props.sTemp;
  const cInvite: ChatInvite = reactive({
    civContentOrNot: false,
    civSearchLoading: false, // used for toggling loading bar for search
    civSearchInput: '',
  });

  let datas: UserTb[];

  const searchUsers = (myId: number, key: string) => {
    // destroy any previous listings in user's view
    cInvite.civContentOrNot = false;
    //activate loading bar
    cInvite.civSearchLoading = true;
    if (key.length < 1) {
      cInvite.civSearchLoading = false;
      return ;
    }

    const tmp = {
      'searcherId': myId,
      'key': key,
    }

    fetch(`${$HOST}/search-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(tmp),
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
      // If cInvite.civContentOrNot === 0, then the part where the 
      // results are made into listings would not be created.
      // data.length === 0 means the returned array has nothing
      // therefore, we wont create any listings
      if ( data.length > 0) {
        cInvite.civContentOrNot = true; 
      }             
    })
    .catch(error => {});
  }

</script>
<template>
  <div class="Chat-invite">
    <input class="Search-box" 
      placeholder="Find user by *name"
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
</template>
<style scoped>
.Chat-invite {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  padding: 5px;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.Chat-invite::-webkit-scrollbar {
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