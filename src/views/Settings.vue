<template>
  <div class="setting-container" @copy.prevent @cut.prevent @paste.prevent @contextmenu.prevent>
    <a-layout-header class="setting-layout-header">
      <span class="setting-layout-header-text">设置</span>
    </a-layout-header>
    <a-layout-content class="setting-layout-content">
      <a-button type="primary">Primary Button</a-button>
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";


</script>
<style scoped>
.setting-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.setting-layout-header {
  background: #fff;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.setting-layout-header-text {
  font-size: 20px;
  font-weight: 500;
}

.setting-layout-content {
  margin: 16px;
}

</style>
