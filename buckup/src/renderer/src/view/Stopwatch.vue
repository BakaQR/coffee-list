<template>
  <div class="stopwatch_TopContainer">
    <el-container class="stopwatch_Container">
      <el-header class="stopwatch_Header">
        <IconButton
          name="AsideMenuButton"
          class="asideMenuButton"
          :background-anim="true"
          :scale-anim="true"
          :icon-url="AsideMenuIcon"
          :click-event="iconButtonEvent"
        ></IconButton>
        <el-text>stopwatch page</el-text>
      </el-header>
      <el-main class="stopwatch_Body"> Main</el-main>
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
.stopwatch_TopContainer {
  width: 100%;
  height: 100%;
}

.stopwatch_Container {
  width: 100%;
  height: 100%;
  background-color: aqua;
}

.stopwatch_Header {
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

.stopwatch_Body {
  background-color: v-bind(color_Light_BackgroundColor);
}

.el-text {
  color: v-bind(color_Light_HighlightReversalColor);
}
</style>
