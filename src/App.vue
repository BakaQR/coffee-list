<script setup lang="ts">

</script>

<template>
  <div class="app-container" @copy.prevent @cut.prevent @paste.prevent @contextmenu.prevent>
    <router-view />
    <router-link @dragstart.prevent to="/">Home</router-link>
    <router-link @dragstart.prevent to="/about">About</router-link>
    <router-link @dragstart.prevent to="/settings">Settings</router-link>
  </div>
</template>

<style scoped>

.app-container .logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.app-container .logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

.app-container {
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

</style>
