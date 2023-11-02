<script setup lang="ts">
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

defineProps<{
  name: string
  msg: string
  time: string
  status: string
}>()

const { trimDate } = useGlobal()
</script>
<template>
  <div class="Chn-list-item-msg">
    <p class="Message-poster" v-if="!status.match(/^exited$|^joined$/)">{{ name }}</p>
    <p class="Message-content" v-if="!status.match(/^exited$|^joined$/)">{{ msg }}</p>
    <p class="Message-content-exited" v-if="status == 'exited'">{{ name }} has left the channel</p>
    <p class="Message-content-joined" v-if="status == 'joined'">
      {{ name }} has joined the channel
    </p>
    <span class="Message-content-time" v-if="!status.match(/^exited$|^joined$/)">{{ trimDate(time) }}</span>
    <span class="Message-delivery-status" v-if="status === 'pending'">◷</span>
  </div>
</template>
<style scoped>
.Chn-list-item-msg {
  display: block;
  position: relative;
  margin: 5px 0;
  padding: 2px 10px;
  border-radius: 5px;
  background-color: #f5f5dc;
  word-break: break-word;
  width: max-content;
  max-width: 90%;
}
.Message-poster {
  display: block;
  position: relative;
  font-size: 10px;
  font-weight: 700;
  line-height: 10px;
  min-width: 150px;
}
.Message-content {
  display: block;
  position: relative;
  font-size: 12px;
  line-height: 15px;
  padding-top: 2px;
}
.Message-content-exited {
  font-size: 12px;
  font-style: italic;
  color: red;
}
.Message-content-joined {
  font-size: 12px;
  font-style: italic;
  color: green;
}
.Message-content-time {
  display: block;
  white-space: nowrap;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 8px;
  font-weight: 400;
  padding: 0 5px;
  background-color: inherit;
  border-radius: 5px;
  color: #1c39bb;
  font-style: italic;
}
.Message-delivery-status {
  display: block;
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  font-size: 10px;
}
</style>
