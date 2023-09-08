<script setup lang="ts">
  import { ref, reactive, inject } from 'vue'
  import { onMounted, onUnmounted } from 'vue'
  import ChatBlockedItem from '@/components/khrov-chat/ChatBlockedItem.vue';
  import type { ChatBlocked, Chat_unionTb } from '@/components/khrov-chat/interface/khrov-chat'

  const props =  defineProps< {
    sTemp: number,
  } >()

  const $HOST = inject('$HOST');

  const $: number = props.sTemp as unknown as number;
  const cBlkd: ChatBlocked = reactive({
    cbkKeyBuild: 0,
  });
  let output: Chat_unionTb[];

  const searchBlocked = () => {
    fetch(`${$HOST}/chats/blocked/${$}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      },
    })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(data => {
      if (JSON.stringify(output) != JSON.stringify(data)) {
        output = data;
        cBlkd.cbkKeyBuild += 1;
      }   
    })
    .catch(error => {});
  }

  let intervalId: ReturnType<typeof setInterval>;
  onMounted(() => {
    searchBlocked();
    intervalId = setInterval(searchBlocked, 3000);
  });
  onUnmounted(() => {
    clearInterval(intervalId);
  });

</script>
<template>
  <div v-if="cBlkd.cbkKeyBuild" :key="cBlkd.cbkKeyBuild">
    <ChatBlockedItem v-for='(item, index) in output'
      :myId="$"
      :theirId="item.client2Id"
      :displayName="item.client2.userName"
      :profileDp="item.client2.profile_pics[0].avatar"
    />
  </div>
</template>
<style scoped>

</style>
