<template>
  <transition name="fadeAnim">
    <div v-if="compAsideMenuStore.isShow" class="asideMenuDiv">
      <div class="asideMenuLogo"></div>
      <el-menu :default-active="$router.currentRoute.value.path" router>
        <el-menu-item index="/home" @click="disableAsideMenu">
          <el-icon size="40px"><Memo /></el-icon>
          <span class="asideMenuText">便签</span>
        </el-menu-item>
        <el-menu-item index="/timeline" @click="disableAsideMenu">
          <el-icon size="40px"><DataLine /></el-icon>
          <span class="asideMenuText">时间线</span>
        </el-menu-item>
        <el-menu-item index="/stopwatch" @click="disableAsideMenu">
          <el-icon size="40px"><Timer /></el-icon>
          <span class="asideMenuText">秒表</span>
        </el-menu-item>
        <el-menu-item index="/timer" @click="disableAsideMenu">
          <el-icon size="40px"><Clock /></el-icon>
          <span class="asideMenuText">定时器</span>
        </el-menu-item>
        <el-menu-item index="/setting" @click="disableAsideMenu">
          <el-icon size="40px"><setting /></el-icon>
          <span class="asideMenuText">设置</span>
        </el-menu-item>
      </el-menu>
    </div>
  </transition>
</template>

<script setup lang="ts">
// 该组件应为全局唯一 放置于 #app 模板下
// css图层优先级 11

import {
  color_BrandPrimaryColor,
  color_Light_BrandHoverColor,
  color_Light_BrandActiveColor,
  color_Light_HighlightColor,
  color_Light_HighlightReversalColor
} from '@renderer/utils/color'

import { useCompAsideMenuStore, useCompCoverStore } from '@renderer/pinia/store/GlobalComponentData'
const compAsideMenuStore = useCompAsideMenuStore()
const compCoverStore = useCompCoverStore()
const disableAsideMenu = () => {
  compCoverStore.disable()
  compAsideMenuStore.disable()
}
</script>

<style scoped lang="scss">
$width: 180px;

.asideMenuDiv {
  width: $width;
  height: 100%;
  background-color: v-bind(color_BrandPrimaryColor);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 11;
  overflow: hidden;
}

.fadeAnim-enter-active,
.fadeAnim-leave-active {
  transition: width 0.25s;
}

.fadeAnim-enter-from,
.fadeAnim-leave-to {
  width: 0;
}

.asideMenuText {
  font-size: medium;
}

.asideMenuLogo {
  height: 60px;
}

.el-menu {
  background-color: v-bind(color_BrandPrimaryColor);
}

.el-menu-item {
  background-color: v-bind(color_BrandPrimaryColor);
  color: v-bind(color_Light_HighlightReversalColor);
  width: $width;

  &:hover {
    background-color: v-bind(color_Light_BrandHoverColor);
  }
  &:active {
    background-color: v-bind(color_Light_BrandActiveColor);
  }
}

.is-active {
  color: v-bind(color_Light_HighlightColor);
}
</style>
