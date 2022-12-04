<script setup lang="ts">
defineProps<{
  userId: number
  userName: string
  chId: number
}>()
</script>
<template>
  <div class="Cli-pendings">
    <p>{{ userName }}</p>
    <img src="/khrov-chat-media/approve.png" alt="Approve" @click="$emit('toApprove', true)" />
    <img
      class="Cli-pendings-reject"
      src="/khrov-chat-media/reject.png"
      alt="Reject"
      @click="$emit('toApprove', false)"
    />
  </div>
</template>
<style scoped>
.Cli-pendings {
  display: grid;
  grid-template-columns: 5fr 1fr 1fr;
  align-items: center;
  position: relative;
  width: 90%;
  height: 30px;
  margin: 1px;
  padding: 0 5px;
  border-radius: 5px;
  background-color: #90ee90;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.Cli-pendings:hover {
  background-color: #ecffdc;
}

.Cli-pendings > p:nth-child(1) {
  font-size: 14px;
  font-weight: 500;
  text-spacing: 1px;
}

.Cli-pendings > img:nth-child(2) {
  position: relative;
  width: 20px;
  height: 20px;
  top: 25%;
  transform: translateY(-45%);
  -ms-transform: translateY(-45%);
  cursor: pointer;
  margin: 0 auto;
  padding: 0.5px 0px;
  -webkit-transition: 1s;
  transition: 1s;
}
.Cli-pendings > img:nth-child(2):hover,
.Cli-pendings > img:nth-child(2):focus {
  padding: 0;
}

.Cli-pendings > img:nth-child(3) {
  position: relative;
  width: 23px;
  height: 23px;
  top: 30%;
  transform: translateY(-45%);
  -ms-transform: translateY(-45%);
  cursor: pointer;
  margin: 0 auto;
  padding: 0.5px 0px;
  -webkit-transition: 1s;
  transition: 1s;
}
.Cli-pendings > img:nth-child(3):hover,
.Cli-pendings > img:nth-child(3):focus {
  padding: 0;
}
</style>
