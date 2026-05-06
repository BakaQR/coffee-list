<template>
  <div
    class="body_NoteItem"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mouseup="beClickEvent"
  >
    <IconTransition
      class="icon"
      :icon-url="noteIcon"
      :icon-highlight-url="noteHighlightIcon"
      :enable="iconAnimEnable"
      :size="'80px'"
    ></IconTransition>
    <div class="describeDiv">
      <span class="text">{{ props.titleText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'
import IconTransition from '@renderer/components/IconTransition.vue'
import noteIcon from '@renderer/assets/svg/Icon/Note.svg'
import noteHighlightIcon from '@renderer/assets/svg/Icon/NoteHighlight.svg'
import {
  color_ExtralightFill,
  color_DarkFill,
  color_Light_HighlightReversalColor
} from '@renderer/utils/color'
import { Data_ContextMenu } from '@renderer/utils/dataStoreInterface'
import { useCompContextMenuStore } from '@renderer/pinia/store/GlobalComponentData'
import { useCompHomeStore } from '@renderer/pinia/store/ViewComponentData'
import editIcon from '@renderer/assets/svg/Icon/edit/edit_blue.svg'
import deleteIcon from '@renderer/assets/svg/Icon/delete.svg'

const compContextMenuStore = useCompContextMenuStore()
const compHomeStore = useCompHomeStore()

const props = defineProps({
  itemId: String,
  titleText: {
    type: String,
    default: 'default title text'
  }
})

const iconAnimEnable = ref(false)
const onMouseEnter = () => {
  iconAnimEnable.value = true
}
const onMouseLeave = () => {
  iconAnimEnable.value = false
}

const beClickEvent = async (event: MouseEvent) => {
  if (event.button === 0) {
    // 打开便签详情面板
  } else if (event.button === 2) {
    // 右键点击时打开上下文菜单
    compContextMenuStore.updatePosition(event.clientX, event.clientY)
    compContextMenuStore.setTargetElement(event.target as Element)
    compContextMenuStore.options = contextMenuOptions
    compContextMenuStore.enable()
  }
}

// 上下文菜单选项与函数初始化
const contextMenuOptions: Data_ContextMenu = {
  optionsList: ['编辑', '删除'],
  optionsClickFunction: [
    // 编辑
    () => {
      console.log(props.itemId)
      compContextMenuStore.disable()
    },
    // 删除
    async () => {
      // 需要完全解包响应式数据才能传递给主线程
      let list = JSON.parse(
        JSON.stringify(
          toRaw(compHomeStore.noteItemsList.filter((item) => item.id !== props.itemId))
        )
      )
      compHomeStore.updateNoteItems(list)
      compContextMenuStore.disable()
    }
  ],
  optionsUrl: [editIcon, deleteIcon]
}
</script>

<style scoped lang="scss">
$bodyWidth: 150px;

.body_NoteItem {
  position: relative;
  display: inline-block;
  transition: background-color 0.2s;
  width: $bodyWidth;
  height: 100%;
  text-align: center;
  border-radius: 15px;
  padding: 10px;
  background-color: v-bind(color_Light_HighlightReversalColor);
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: v-bind(color_ExtralightFill);
  }
  &:active {
    background-color: v-bind(color_DarkFill);
  }
}

.icon {
  position: relative;
}

.describeDiv {
  display: block;
  text-align: center;
  .text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowarp;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
