<template>
  <div class="setting_TopContainer">
    <el-container class="setting_Container">
      <el-header class="setting_Header">
        <IconButton
          name="AsideMenuButton"
          class="asideMenuButton"
          :background-anim="true"
          :scale-anim="true"
          :icon-url="AsideMenuIcon"
          :click-event="iconButtonEvent"
        ></IconButton>
        <p class="setting_titleText">设置</p>
      </el-header>
      <el-main class="setting_Body">
        <div class="setting_Body_System">
          <p>系统</p>
          <div class="setting_Body_Options">
            <span>关闭时最小化到系统托盘</span>
            <el-switch v-model="isMinimize" />
          </div>
        </div>
      </el-main>
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
import { computed } from 'vue'
import { useCompCoverStore, useCompAsideMenuStore } from '@renderer/pinia/store/GlobalComponentData'
import { useSettingsStore } from '@renderer/pinia/store/ViewComponentData'
const compCoverStore = useCompCoverStore()
const compAsideMenuStore = useCompAsideMenuStore()
const compSettingsStore = useSettingsStore()

const iconButtonEvent = () => {
  compCoverStore.enable()
  compAsideMenuStore.enable()
  compCoverStore.defineClickFunction(() => {
    compCoverStore.disable()
    compAsideMenuStore.disable()
  })
}

const isMinimize = computed({
  get: () => compSettingsStore.settings.isMinimize,
  set: (v) =>
    compSettingsStore.modifySettings({
      name: 'isMinimize',
      value: v
    })
})
</script>

<style scoped lang="scss">
.setting_TopContainer {
  width: 100%;
  height: 100%;
}

.setting_Container {
  width: 100%;
  height: 100%;
  background-color: aqua;
}

.setting_Header {
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

.setting_Body {
  background-color: v-bind(color_Light_BackgroundColor);
}

.setting_titleText {
  color: v-bind(color_Light_HighlightReversalColor);
  font-size: larger;
}

.setting_Body_System {
  background-color: v-bind(color_Light_HighlightReversalColor);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: medium;
  font-weight: bold;
}

.setting_Body_Options {
  font-weight: normal;
  font-size: medium;
  margin: 10px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
</style>
