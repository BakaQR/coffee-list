<template>
  <div
    class="view-container"
    @copy.prevent
    @cut.prevent
    @paste.prevent
    @contextmenu.prevent
  >
    <a-layout-header class="view-layout-header">
      <span class="view-layout-header-text">设置</span>
    </a-layout-header>
    <a-layout-content class="view-layout-content">
      <a-button type="primary">Primary Button</a-button>
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
// import { ref } from "vue";
</script>
<style scoped lang="scss">
@use 'style/_layout';
</style>
