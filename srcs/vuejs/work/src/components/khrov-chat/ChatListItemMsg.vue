<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { PropType } from 'vue'
  import type { MessageItem } from '@/components/khrov-chat/interface/khrov-chat';

  const props =  defineProps< {
    incoming: string | null,
    outgoing: string | null,
    time: string,
    status: string,
  } >()

  const msgItem: MessageItem = reactive({});
  
  msgItem.msiTimeAlign = props.outgoing==null ? false : true;
  msgItem.msiSentOrRcvd = props.outgoing==null ? 'Received' : 'Sent';
  msgItem.msiMsg = props.outgoing==null ? props.incoming : props.outgoing;
  msgItem.msiClearFloat = props.outgoing==null ? 'Clear-left' : 'Clear-right';
  msgItem.msiTime = props.time;
  if ( props.status==='pending' )
    msgItem.msiStatusOut = '◷';
  else if ( props.status==='sent' )
    msgItem.msiStatusOut = '✓';
  else if ( props.status==='delivered' )
    msgItem.msiStatusOut = '✓✓';
  else if ( props.status==='seen' )
    msgItem.msiStatusOut = '👁';
</script>
<template>
  <div>
    <div :class="msgItem.msiSentOrRcvd">
      {{msgItem.msiMsg}}
      <span class="Time-status-container" :class="{'AlignTimeRight': msgItem.msiTimeAlign}">
         {{msgItem.msiTime}} <span class="Status-mark" v-if="!incoming">{{msgItem.msiStatusOut}}</span>
      </span>
    </div>
    <p :class="msgItem.msiClearFloat"></p>
  </div>
</template>
<style scoped>
.Sent {
  display: block;
  position: relative;
  float: right;
  margin: 5px 0 5px 20%;
  padding: 2px 5px;
  border-style: solid;
  border-width: 2px;
  border-color: #c6f9d9;
  border-radius: 5px;
  background-color: #d4f7e1;
  overflow-wrap: break-word;
}
.Clear-right {
  clear: right;
}
.Received {
  display: block;
  position: relative;
  float: left;
  margin: 5px 20% 5px 0;
  padding: 2px 5px;
  border-style: solid;
  border-width: 2px;
  border-color: #fff;
  border-radius: 5px;
  background-color: #F5F5DC;
  word-break: break-word;
}
.Clear-left {
  clear: left;
}

.Time-status-container {
  display: block;
  white-space: nowrap; 
  position: absolute;
  bottom: -8px;
  font-size: 8px;
  font-weight: 400;
  color: black;
  padding-left: 5px;
  background-color: inherit;
  border-radius: 5px;
}
.AlignTimeRight {
  right: 0;
}
.Status-mark {
  color: #1C39BB;
  font-weight: 600;
}

</style>
