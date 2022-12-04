<script setup lang="ts">
</script>
<template>
  <div class="Mobile-nav">
    <div class="Mobile-nav-row1">
      <p @click="$emit('hideMobileMenuEvent')">✕</p>
    </div>
  </div>
</template>

<style scoped>
.Mobile-nav {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px 150px 150px 50px 50px 50px;

  position: relative;
  width: 100%;
  color: var(--header-font-color);
  padding-right: 20px;
  /* margin-top: 50px; */
}
.Mobile-nav > * {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 10px;
}

.Mobile-nav-row1 > img:nth-child(1) {
  display: inline-block;
  position: relative;
  height: 70%;
  width: auto;
  left: 40%;
  cursor: pointer;
  transform: translateX(-40%);
  -ms-transform: translateX(-40%);
}
.Mobile-nav-row1 > p:nth-child(2) {
  display: inline-block;
  font-size: 20px;
  line-height: 15px;
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
}








/* 
.Mobile-nav >div:nth-child(2) >img:nth-child(1) {
  display: block;
  position: relative;
  height: 70%;
  aspect-ratio: 60/35;
  border-radius: 15px;
  margin: 0 auto;
  margin-top: 8%;
}
.Mobile-nav >div:nth-child(3) {
  text-align: center;
}
.Mobile-nav >div:nth-child(3) >p:nth-child(1) {
  display: block;
  position: relative;
  margin-top: 8%;
  font-size: 0.9rem;
  font-weight: 300;
  padding-bottom: 8%;
}
.Mobile-nav >div:nth-child(3) >a:nth-child(2) {
  position: relative;
  background-color: #FF5733;
  white-space: nowrap; 
  border-radius: 5px;
  padding: 2px 6px 4px;
  text-align: center;
  color: black;
}
.Mobile-nav >div:nth-child(3) >a:nth-child(2):hover,
.Mobile-nav >div:nth-child(3) >a:nth-child(2):focus {
  background-color: #FFAA33;
}
.Mobile-nav >div:nth-child(4) {
  padding-top: 15px;
}
.Mobile-nav >div:nth-child(4) >img:nth-child(1) {
  display: inline-block;
  position: relative;
  height: 20px;
  aspect-ratio: 1.2/1;
  margin: 0 10px;
}
.Mobile-nav >div:nth-child(4) >a:nth-child(2) {
  display: inline-block;
  position: relative;
  font-size: 1.2rem;
  font-weight: 300;
}
.Mobile-nav >div:nth-child(5) {
  padding-top: 15px;
}
.Mobile-nav >div:nth-child(5) >img:nth-child(1) {
  display: inline-block;
  position: relative;
  height: 20px;
  aspect-ratio: 1.2/1;
  margin: 0 10px;
}
.Mobile-nav >div:nth-child(5) >a:nth-child(2) {
  display: inline-block;
  position: relative;
  font-size: 1.2rem;
  font-weight: 300;
}
.Mobile-nav >div:nth-child(6) {
  padding-top: 15px;
}
.Mobile-nav >div:nth-child(6) >img:nth-child(1) {
  display: inline-block;
  position: relative;
  height: 20px;
  aspect-ratio: 1.2/1;
  margin: 0 10px;
}
.Mobile-nav >div:nth-child(6) >a:nth-child(2) {
  display: inline-block;
  position: relative;
  font-size: 1.2rem;
  font-weight: 300;
} */

</style>
