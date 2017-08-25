<script setup lang="ts">
defineProps<{
  channelId: number
  channelName: string
  desc: string
  visibility: string
  role: string
  unread: number
}>()
</script>
<template>
  <div class="Channel-preview">
    <img class="Visibility" :src="visibility" alt="Visibility" />
    <div class="Chan-texts">
      <span class="Chan-name">{{ channelName }}</span>
      <span class="Channel-desc">{{ desc }}</span>
      <span class="Channel-notif" v-if="unread">{{ unread }}</span>
    </div>
  </div>
</template>
<style scoped>
.Channel-preview {
  display: grid;
  grid-template-columns: 0.5fr 7fr;
  grid-template-rows: 45px;
  width: 100%;
  height: 45px;
  padding: 0 5px;
  position: relative;
  background-color: rgb(245, 245, 245);
  margin: 2px 0;
  border-radius: 5px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  cursor: pointer;
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
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
}
.Channel-notif {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  width: auto;
  height: auto;
  min-width: 18px;
  min-height: 18px;
  border-radius: 10px;
  background-color: green;
  font-weight: bold;
  color: white;
  text-align: center;
  padding: 1px 2px 2px 1px;
}
</style>
