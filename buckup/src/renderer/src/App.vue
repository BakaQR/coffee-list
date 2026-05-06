<template>
  <div class="mainDiv">
    <!-- 侧边栏 -->
    <AsideMenu></AsideMenu>
    <!-- 创建便签 -->
    <CreateNoteItem></CreateNoteItem>
    <!-- 黑色覆盖层 -->
    <CoverLayout></CoverLayout>
    <!-- 右键上下文菜单 -->
    <ContextMenu></ContextMenu>

    <!-- 路由页面 -->
    <RouterView></RouterView>

    <el-button class="templateButton" @click="$router.push('/template')">T</el-button>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

// 导入组件
import CoverLayout from '@renderer/components/CoverLayout.vue'
import AsideMenu from './components/AsideMenu.vue'
import CreateNoteItem from './components/note_item/CreateNoteItem.vue'
import ContextMenu from './components/ContextMenu.vue'

// 全局禁用 tab 键
window.disableTab()
</script>

<style scoped lang="scss">
.mainDiv {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.templateButton {
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 0;
}
</style>
