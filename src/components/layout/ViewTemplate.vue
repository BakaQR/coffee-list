<template>
  <div class="view-container">
    <a-layout-header class="view-layout-header">
      <a-row style="width: 100%" justify="space-between" align="middle">
        <a-col :span="2" style="text-align: left">
          <span class="view-layout-header-text">设置</span>
        </a-col>
        <a-col :span="2" style="text-align: right">
          
        </a-col>
      </a-row>
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
@use '_layout';
</style>
