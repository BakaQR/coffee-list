<template>
  <div class="timer_TopContainer">
    <el-container class="timer_Container">
      <el-header class="timer_Header">
        <IconButton
          name="AsideMenuButton"
          class="asideMenuButton"
          :background-anim="true"
          :scale-anim="true"
          :icon-url="AsideMenuIcon"
          :click-event="iconButtonEvent"
        ></IconButton>
        <el-text>timer page</el-text>
      </el-header>
      <el-main class="timer_Body"> Main</el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// 导入图标
import AsideMenuIcon from '@renderer/assets/svg/Icon/SolarHamburgerMenuLinear.svg'

// 导入组件
import IconButton from '@renderer/components/IconButton.vue'

// 导入颜色
import {
  color_BrandPrimaryColor,
  color_Light_BackgroundColor,
  color_Light_HighlightReversalColor
} from '@renderer/utils/color'

// 导入组件所用数据仓库
import { useCompCoverStore, useCompAsideMenuStore } from '@renderer/pinia/store/GlobalComponentData'
const compCoverStore = useCompCoverStore()
const compAsideMenuStore = useCompAsideMenuStore()
const iconButtonEvent = () => {
  compCoverStore.enable()
  compAsideMenuStore.enable()
  compCoverStore.defineClickFunction(() => {
    compCoverStore.disable()
    compAsideMenuStore.disable()
  })
}
</script>

<style scoped lang="scss">
.timer_TopContainer {
  width: 100%;
  height: 100%;
}

.timer_Container {
  width: 100%;
  height: 100%;
  background-color: aqua;
}

.timer_Header {
  background-color: v-bind(color_BrandPrimaryColor);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.asideMenuButton {
  position: absolute;
  left: 0;
  margin-left: 14px;
}

.timer_Body {
  background-color: v-bind(color_Light_BackgroundColor);
}

.el-text {
  color: v-bind(color_Light_HighlightReversalColor);
}
</style>
