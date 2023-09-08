<script setup lang="ts">
</script>

<template>
  <div id="Icon-container">
    <p class="Chat-count">+N</p>
    <img id="Chat-icon" alt="Chat Icon" src="/khrov-chat-media/chat-icon.svg"  />
  </div>
</template>

<style scoped>
#Icon-container {
  position: relative;
  height: 100%;
  width: 100%;
  cursor: pointer;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
}
#Icon-container:hover {
  height: 58px;
}

.Chat-count {
  position: absolute;
  right: 0;
  top: -5px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: red;
  font-size: 13px;
  font-weight: bold;
  color: white;
  text-align: center;
  padding: 0 2px 2px 0;
}

#Chat-icon {
  width: 100%;
  height: 100%;
}

@media (min-width: 700px) {
}
</style>