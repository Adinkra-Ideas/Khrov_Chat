<script setup lang="ts">
  import ChatListItem from '@/components/khrov-chat/ChatListItem.vue';
  
  let json = [
      {
        avatar: "/khrov-chat-media/avatar.png",
        header: "Nosa Andrews",
        time: "6:38 PM",
        msg: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
        notif: 1,
      },
      {
        avatar: "/khrov-chat-media/avatar.png",
        header: "Daniel Foo",
        time: "4:42 PM",
        msg: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
        notif: 300,
      },
      {
        avatar: "/khrov-chat-media/avatar.png",
        header: "Gift Uyi",
        time: "3:35 PM",
        msg: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet",
        notif: 63,
      }
  ];

</script>

<template>
  <ChatListItem v-for='(item, index) in json'
    :avatar="item.avatar"
    :header="item.header"
    :time="item.time"
    :msg="item.msg" 
    :notif="item.notif" 
    />
</template>


