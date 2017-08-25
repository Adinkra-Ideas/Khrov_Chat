<template>
  <div class="Hamburger">
    <span class="icon-bars"></span>
    <span class="icon-bars overlay"></span>
  </div>
</template>

<style scoped>
.Hamburger {
  height: 14px;
  width: 30px;
}
.icon-bars {
  display: block;
  position: relative;
  left: 0;
  top: 0px;
  margin: 0;
  height: 2px;
  width: 30px;
  background: transparent;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.icon-bars::before {
  content: '';
  display: block;
  position: relative;
  left: 0;
  top: 6px;
  margin: 0;
  height: 2px;
  width: 30px;
  background: transparent;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.icon-bars::after {
  content: '';
  display: block;
  position: relative;
  left: 0;
  top: 10px;
  margin: 0;
  height: 2px;
  width: 30px;
  background: transparent;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

</style>
