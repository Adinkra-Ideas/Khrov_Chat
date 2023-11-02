<script setup lang="ts">
import { useChatBlocked } from '@/components/khrov-chat/composables/ChatBlocked'
import ChatBlockedItem from '@/components/khrov-chat/ChatBlockedItem.vue'

const { cBlkd } = useChatBlocked()
</script>
<template>
  <div v-if="cBlkd.cbkKeyBuild" :key="cBlkd.cbkKeyBuild">
    <ChatBlockedItem
      v-for="item in cBlkd.output"
      v-bind:key="item.client2Id"
      :theirId="item.client2Id"
      :displayName="item.client2.userName"
      :profileDp="item.client2.profile_pics[0].avatar"
    />
  </div>
</template>
<style scoped></style>
