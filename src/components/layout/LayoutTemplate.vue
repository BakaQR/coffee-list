<template>
  <div class="view-container">
    <a-layout-header class="view-layout-header">
      <a-row style="width: 100%" justify="space-between" align="middle">
        <a-col :span="12" class="text-left h-full">
          <span class="view-layout-header-text">{{ props.title }}</span>
        </a-col>
        <a-col :span="8" class="h-full flex! flex-row! justify-end!">
          <slot name="headerAction" />
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="view-layout-content">
      <slot name="bodyContent" />
    </a-layout-content>

    <!-- 用于 model 等不包裹在页面 content 中的组件 -->
    <slot name="outsideAction" />
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
