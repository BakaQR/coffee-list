<template>
  <div class="home-container" @copy.prevent @cut.prevent @paste.prevent @contextmenu.prevent>
    <a-layout-header class="home-layout-header">
      <span class="home-layout-header-text">便签</span>
    </a-layout-header>
    <a-layout-content class="home-layout-content">
        
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";


</script>
<style scoped>
.home-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.home-layout-header {
  background: #fff;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.home-layout-header-text {
  font-size: 20px;
  font-weight: 500;
}

.home-layout-content {
  margin: 16px;
}

</style>
