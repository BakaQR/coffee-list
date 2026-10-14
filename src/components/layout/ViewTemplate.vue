<template>
  <div class="view-container">
    <a-layout-header class="view-layout-header">
      <a-row style="width: 100%" justify="space-between" align="middle">
        <a-col :span="2" style="text-align: left">
          <span class="view-layout-header-text">{{ props.title }}</span>
        </a-col>
        <a-col :span="2" style="text-align: right">
          <slot name="header_action" />
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="view-layout-content">
      <slot name="content" />
    </a-layout-content>

    <!-- 用于 model 等不包裹在页面 content 中的组件 -->
    <slot name="outside_action" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '模板首页',
  },
})
</script>
<style scoped lang="scss">
@use '_layout';
</style>
