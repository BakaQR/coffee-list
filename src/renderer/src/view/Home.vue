<template>
  <div class="home_TopContainer">
    <el-container class="home_Container">
      <el-header class="home_Header">
        <!-- 展开侧边栏 -->
        <IconButton
          class="asideMenuButton"
          :background-anim="true"
          :scale-anim="true"
          :icon-url="AsideMenuIcon"
          :click-event="iconButtonEvent"
        ></IconButton>
        <!-- 日期选择器 -->
        <div class="home_dataPickerDiv">
          <el-date-picker
            v-model="selectDate"
            class="home_dataPicker"
            type="date"
            :editable="false"
            :clearable="false"
            value-format="YYYY-M-D"
          />
        </div>
      </el-header>
      <el-main class="home_Body">
        <!-- 添加便签按钮 -->
        <AddNoteItemButton
          class="createNoteItemButton"
          @add-note-item-option-event="addNoteItemEvent"
        ></AddNoteItemButton>
        <!-- 便签内容栏 -->
        <el-scrollbar class="home_NoteItemDiv" view-class="noteItemContainer">
          <VueDraggable
            v-model="dragList"
            class="grid-container"
            item-key="id"
            :animation="100"
            :force-fallback="true"
            ghost-class="ghost-item"
            :fallback-tolerance="50"
            @start="onDragStartEvent"
            @end="onDragEndEvent"
          >
            <NoteItem
              v-for="item in noteItemsStore.noteItemsList"
              :key="item.id"
              :item-id="item.id"
              :title-text="item.title"
              :content-text="item.content"
              :is-check="item.check"
              :notification-options="item.notificationOptions"
              :is-dragging="isDragging"
              class="noteItem"
            ></NoteItem>
          </VueDraggable>
          <div class="placeholder_Home"></div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
const viewName = 'Home'

import {
  color_BrandPrimaryColor,
  color_Light_BackgroundColor,
  color_Dark_BackgroundColor
} from '@renderer/utils/color'

// 导入图标
import AsideMenuIcon from '@renderer/assets/svg/Icon/SolarHamburgerMenuLinear.svg'

// 导入组件所用数据仓库
import { computed, onMounted, ref } from 'vue'
import { useCompCoverStore, useCompAsideMenuStore } from '@renderer/pinia/store/GlobalComponentData'
import { useCompCreateNoteItemStore } from '@renderer/pinia/store/GlobalComponentData'
import { useNoteItemsStore } from '@renderer/pinia/store/ViewComponentData'
const compCoverStore = useCompCoverStore()
const compAsideMenuStore = useCompAsideMenuStore()
const compCreateNoteItemStore = useCompCreateNoteItemStore()
const noteItemsStore = useNoteItemsStore()

// 获取当天日期并初始化到 datepicker 中
import { getNowDateFormatYYYYMD } from '@renderer/utils/dateFormat'
const selectDate = ref(getNowDateFormatYYYYMD())

// 导入组件
import IconButton from '@renderer/components/IconButton.vue'
import NoteItem from '@renderer/components/note_item/NoteItem.vue'
import AddNoteItemButton from '@renderer/components/note_item/AddNoteItemButton.vue'
import { VueDraggable } from 'vue-draggable-plus'

const dragList = computed({
  get: () => noteItemsStore.noteItemsList,
  set: async (value) => noteItemsStore.updateNoteItems(value)
})

// 展开侧边栏
const iconButtonEvent = () => {
  compCoverStore.enable()
  compAsideMenuStore.enable()
  compCoverStore.defineClickFunction(() => {
    compCoverStore.disable()
    compAsideMenuStore.disable()
  })
}

// 右下角添加便签按钮事件
const addNoteItemEvent = () => {
  compCreateNoteItemStore.enable()
}

const isDragging = ref(false)
const onDragStartEvent = () => {
  isDragging.value = true
}
const onDragEndEvent = () => {
  isDragging.value = false
}

onMounted(() => {
  noteItemsStore.reloadNoteItemsData()
  console.log(`[${viewName}] ` + 'Home page initialization')
})
</script>

<style scoped lang="scss">
$dataPickerWidth: 120px;
$noteItemWidth: 150px; // 用于网格大小 在 NoteItem 中也定义了大小 计划需要迁移到数据仓库中

.home_TopContainer {
  width: 100%;
  height: 100%;
}

.home_Container {
  width: 100%;
  height: 100%;
  background-color: aqua;
}

.home_Header {
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

.home_dataPickerDiv {
  width: $dataPickerWidth;
  * {
    --el-date-editor-width: $dataPickerWidth;
  }
}

.home_NoteItemDiv {
  transition: all 0.2s;
}

:deep(.noteItemContainer) {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 20px;
}

.home_Body {
  padding: 0;
}

.placeholder_Home {
  height: 20px;
  width: 100%;
}

.createNoteItemButton {
  position: absolute;
  right: 20px;
  bottom: 15px;
}

.grid-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($noteItemWidth, 1fr));
  gap: 30px;
}

.noteItem {
  display: inline-block;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ghost-item {
  opacity: 0.6;
  background: #c8ebfb !important;
}

@media (prefers-color-scheme: light) {
  .home_Body {
    background-color: v-bind(color_Light_BackgroundColor);
  }
}

@media (prefers-color-scheme: dark) {
  .home_Body {
    background-color: v-bind(color_Dark_BackgroundColor);
  }
}
</style>
