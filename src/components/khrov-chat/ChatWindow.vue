<script setup lang="ts">
  import ChatList from '@/components/khrov-chat/ChatList.vue';

  // ******************************************************************
  // we had to pick classNames from within a specific parent element  *
  // by first picking the parent element's ID and then doing          *
  // parentElementID.getElementsByClassName("active"); instead of     *
  // document.getElementsByClassName("active"); in order to avoid     *
  // disturbing other elements within the document that might also    *
  // have 'active' class names                                        *
  // ******************************************************************
  const changeActiveTab = (class_name: string) => {
    // Get the parent containers of both .Li-tabs and .Output-box
    let ul_tabs = document.getElementById('Ul-tabs');
    let output_boxes = document.getElementById('Output-boxes');

    // remove active class from both #Ul-tabs and #Output-boxes child element
    let active_li = ul_tabs.getElementsByClassName("active");
    active_li[0].className = active_li[0].className.replace("active ", "");
    let active_output_boxes = output_boxes.getElementsByClassName("active");
    active_output_boxes[0].className = active_output_boxes[0].className.replace("active ", "");

    // Set active class to both .Li-tabs and .Output-box that got clicked
    let clicked_li = ul_tabs.getElementsByClassName(class_name);
    clicked_li[0].className = clicked_li[0].className.replace("", "active ");
    let clicked_output_boxes = output_boxes.getElementsByClassName(class_name);
    clicked_output_boxes[0].className = clicked_output_boxes[0].className.replace("", "active ");
  }
</script>

<template>
  <div id="Window-container">
    <div>
      <ul id="Ul-tabs">
        <li class="active Chats-tab Li-tabs" @click="changeActiveTab('Chats-tab')">Chats</li> <!-- For list of each user that has been chatted with -->
        <li class="Chatinv-tab Li-tabs" @click="changeActiveTab('Chatinv-tab')">Chat Invite</li> <!-- For inviting users to start chatting.  -->
        <li class="Find-tab Li-tabs" @click="changeActiveTab('Find-tab')">Find</li> <!-- Find users by name and add them as friends, send chat invite, invite to play game -->
        <li class="Channels-tab Li-tabs" @click="changeActiveTab('Channels-tab')">Channels</li> <!-- For list of channels user has participated/been invited -->
        <li class="ChannCreat-tab Li-tabs" @click="changeActiveTab('ChannCreat-tab')">Create Channel</li> <!-- For creating and inviting users -->
       <li class="Block-tab Li-tabs" @click="changeActiveTab('Block-tab')">Block</li>  <!-- Block users by username -->
      </ul>
    </div> 
    <div id="Output-boxes">
      <div class="active Chats-tab Output-box">
        <ChatList />
      </div>
      <div class="Chatinv-tab Output-box">
        chat invite
      </div>
      <div class="Find-tab Output-box">
        Find
      </div>
      <div class="Channels-tab Output-box">
        Channels
      </div>
      <div class="ChannCreat-tab Output-box">
        Create Channel
      </div>
      <div class="Block-tab Output-box">
        Block
      </div>
    </div>
  
  </div>

</template>

<style scoped>
#Window-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content auto;
  /* align-items: center; */

  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 10px 10px 0 0;
  background-image: linear-gradient(#d7e1ec 0%, #fff 74%);
  box-shadow: -1px -5px 10px #d7e1ec;
}
#Window-container > * {
  padding: 5px;
  overflow: hidden;
}
#Window-container:hover {
  box-shadow: -1px -2px 25px #d7e1ec;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}

#Ul-tabs {
  list-style: none;
  margin: 0;
  padding: 0;
}
.Li-tabs {
  display: inline-block;
  padding: 2px 8px;
  margin: 2px;
  cursor: pointer;
  background-color: #73C2FB;
  color: #fff;
  border-radius: 10px 10px 0 0;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.Li-tabs:hover, .Li-tabs.active {
  background-color: #1C39BB;
  box-shadow: -1px -2px 15px #73C2FB;
}


.Output-box {
  display: none;
  height: 100%;
  width: 100%;
  padding: 5px;
  background-color: white;
  position: relative;
  top: 0;
  left: 0;
  border-radius: 10px;
  overflow-y: scroll;

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.Output-box::-webkit-scrollbar {
  display: none;
}

.Output-box.active {
  display: block;
}

</style>
