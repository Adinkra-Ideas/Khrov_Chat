<script setup lang="ts">
  import HamburgerMenu from '@/components/HamburgerMenu.vue'
  import MobileNav from '@/components/MobileNav.vue'
  import { useTheHeader } from '@/components/composables/TheHeader'

  const { vars } = useTheHeader()
</script>
<template>
  <div class="The-header">
    <div class="The-header-nav">
      <div class="The-header-nav-col1">
        <img src="/guth.png" alt="Guth & Wolf"/>
      </div>
      <div class="The-header-nav-col2">
        <ul>
          <li>Admin contact</li>
        </ul>
      </div>
      <div class="The-header-nav-col3">
        <img src="/search-icon-white.png" alt="Search"/>
        <HamburgerMenu class="Hamburger-menu" 
          @click="{
                    vars.MobileMenuWidth='312px';
                    vars.MobileMenuAfterWidth='100vw';
                  }" />
      </div>
    </div>
    <div class="Mobile-menu">
      <MobileNav 
        @hide-mobile-menu-event="{
                    vars.MobileMenuWidth='0px';
                    vars.MobileMenuAfterWidth='0vw';
                  }" />
    </div>
  </div>
</template>
<style scoped>
.The-header-nav {
  display: grid;
  grid-template-columns: minmax(170px, 1fr) 4fr minmax(90px, 1fr);

  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 50px;
  background-image: linear-gradient(to bottom, var(--header-bg) 0%, v-bind('vars.HeaderBgChangeOnScroll') 100%);
  margin: 0;
  overflow: hidden;
  padding-left: 2px;
}
.The-header-nav >* {
  position: relative;
  width: 100%;
  height: 100%;
}

.The-header-nav-col1 > img {
  position: relative;
  width: 95%;
  height: auto;
  top: 50%;
  cursor: pointer;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
}
.The-header-nav-col1 > img:hover,
.The-header-nav-col1 > img:focus {
  width: 96%;
}

.The-header-nav-col2 > ul {
  display: none;
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: end;
}
.The-header-nav-col2 > ul > li {
  display: inline-block;
  position: relative;
  line-height: 50px;
  padding-left: 20px;
  color: var(--header-font-color);
  width: max-content;
  font-weight: 300;
  letter-spacing: 0.8px;
  cursor: pointer;
}
.The-header-nav-col2 >ul >li:hover,
.The-header-nav-col2 >ul >li:focus {
  color: var(--header-font-hover);
}

.The-header-nav-col3 {
  padding-left: 20px;
}
.The-header-nav-col3 > img {
  display: inline-block;
  position: relative;
  width: 16px;
  aspect-ratio: 1/1;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  cursor: pointer;
}
.The-header-nav-col3 > .Hamburger-menu {
  display: inline-block;
  position: relative;
  top: 48%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  cursor: pointer;
  margin-left: 15px;
}

.Mobile-menu {
  display: block;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: v-bind('vars.MobileMenuWidth');
  height: 100vh;
  background-color: var(--header-bg);
  box-shadow: 0 0 25px var(--header-bg);
  overflow: hidden;
}
.Mobile-menu::before {
  content: '';
  display: block;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 0;
  width: v-bind('vars.MobileMenuAfterWidth');
  max-width: calc(100% - 312px);
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

@media (min-width: 640px) {
  /* rearrange the Nav content horizontally */
  .The-header-nav {
    grid-template-columns: minmax(170px, 1fr) 5fr minmax(60px, 0.5fr);
  }
  /* show the desktop nav menu */
  .The-header-nav-col2 > ul {
    display: block;
  }
  /* hide the hamburger menu Icon */
  .The-header-nav-col3 > .Hamburger-menu {
    display: none;
  }
  /* hide the mobile nav menu container */
  .Mobile-menu {
    display: none;
  }
}
</style>
