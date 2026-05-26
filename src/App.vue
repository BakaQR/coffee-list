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
.app-container {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

</style>
