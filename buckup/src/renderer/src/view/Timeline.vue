<template>
  <div class="timeline_TopContainer">
    <el-container class="timeline_Container">
      <el-header class="timeline_Header">
        <IconButton
          name="AsideMenuButton"
          class="asideMenuButton"
          :background-anim="true"
          :scale-anim="true"
          :icon-url="AsideMenuIcon"
          :click-event="iconButtonEvent"
        ></IconButton>
        <div class="timeline_dataPickerDiv">
          <el-date-picker
            v-model="dateRange"
            class="home_dataPicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            :clearable="false"
          />
        </div>
      </el-header>
      <el-main class="timeline_Body"> Main</el-main>
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
import { ref } from 'vue'
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

const dateRange = ref()
</script>

<style scoped lang="scss">
$dataPickerWidth: 250px;

.timeline_TopContainer {
  width: 100%;
  height: 100%;
}

.timeline_Container {
  width: 100%;
  height: 100%;
  background-color: aqua;
}

.timeline_Header {
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

.timeline_Body {
  background-color: v-bind(color_Light_BackgroundColor);
}

.el-text {
  color: v-bind(color_Light_HighlightReversalColor);
}

.timeline_dataPickerDiv {
  width: $dataPickerWidth;
  * {
    --el-date-editor-width: $dataPickerWidth;
  }
}
</style>
