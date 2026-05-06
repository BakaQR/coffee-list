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
    >
    </IconTransition>
    <div class="checkDiv" :class="{ visible: isCheck, hidden: !isCheck }">
      <img :src="checkIcon" />
    </div>
    <div class="describeDiv">
      <span class="text">{{ props.titleText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRaw } from 'vue'
import {
  color_ExtralightFill,
  color_DarkFill,
  color_Light_HighlightReversalColor
} from '@renderer/utils/color'
import IconTransition from '@renderer/components/IconTransition.vue'
import { Data_ContextMenu, Data_NoteItem } from '@renderer/utils/dataStoreInterface'

import {
  useCompContextMenuStore,
  useCompNoteItemDetailStore
} from '@renderer/pinia/store/GlobalComponentData'
import { useNoteItemsStore } from '@renderer/pinia/store/ViewComponentData'
import { useCompEditNoteItemStore } from '@renderer/pinia/store/GlobalComponentData'

import noteIcon from '@renderer/assets/svg/Icon/note/Note.svg'
import noteHighlightIcon from '@renderer/assets/svg/Icon/note/NoteHighlight.svg'
import checkIcon from '@renderer/assets/svg/Icon/note/Check_NoteItem.svg'
import editIcon from '@renderer/assets/svg/Icon/edit/edit_blue.svg'
import deleteIcon from '@renderer/assets/svg/Icon/Delete.svg'

const compContextMenuStore = useCompContextMenuStore()
const compNoteItemsStore = useNoteItemsStore()
const compNoteItemDetailStore = useCompNoteItemDetailStore()
const compEditNoteItemStore = useCompEditNoteItemStore()
const noteItemsStore = useNoteItemsStore()

const props = defineProps({
  itemId: {
    type: String,
    default: '000000'
  },
  titleText: {
    type: String,
    default: 'default title text'
  },
  contentText: {
    type: String,
    default: 'default content text'
  },
  isCheck: {
    type: Boolean,
    default: false
  },
  notificationOptions: {
    type: String,
    default: 'none'
  },
  isDragging: Boolean
})

const isDragging = computed(() => props.isDragging)

const iconAnimEnable = ref(false)
const onMouseEnter = () => {
  iconAnimEnable.value = true
}
const onMouseLeave = () => {
  iconAnimEnable.value = false
}

const beClickEvent = (event: MouseEvent) => {
  if (event.button === 0) {
    if (!isDragging.value) {
      compNoteItemDetailStore.setTitle(props.titleText)
      compNoteItemDetailStore.setContent(props.contentText)
      compNoteItemDetailStore.enable()
    }
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
  optionsList: ['完成', '编辑', '删除'],
  optionsClickFunction: [
    // 完成
    () => {
      let tempNoteItem: Data_NoteItem = {
        id: props.itemId,
        title: props.titleText,
        content: props.contentText,
        check: !props.isCheck, //仅修改check状态
        notificationOptions: props.notificationOptions
      }
      window.electron.ipcRenderer.invoke('noteItem_alter', tempNoteItem).then((_res: boolean) => {
        if (_res) {
          noteItemsStore.reloadNoteItemsData()
          compEditNoteItemStore.disable()
        } else {
          // console.error(`[${viewName}] ` + 'add note item failed !!!')
        }
      })
      compContextMenuStore.disable()
    },
    // 编辑
    () => {
      compEditNoteItemStore.setId(props.itemId)
      compEditNoteItemStore.setTitle(props.titleText)
      compEditNoteItemStore.setContent(props.contentText)
      compEditNoteItemStore.setCheck(props.isCheck)
      compEditNoteItemStore.setNotificationOptions(props.notificationOptions)
      compEditNoteItemStore.enable()
      compContextMenuStore.disable()
    },
    // 删除
    async () => {
      // 需要完全解包响应式数据才能传递给主线程
      let list = JSON.parse(
        JSON.stringify(
          toRaw(compNoteItemsStore.noteItemsList.filter((item) => item.id !== props.itemId))
        )
      )
      compNoteItemsStore.updateNoteItems(list)
      compContextMenuStore.disable()
    }
  ],
  optionsUrl: [checkIcon, editIcon, deleteIcon]
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
  border-radius: 6px;
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

.checkDiv {
  height: 40px;
  width: 40px;
  position: absolute;
  display: inline-block;
  top: 40%;
  left: 50%;
  transition: opacity 0.2s;
}

.visible {
  opacity: 1;
}

.hidden {
  opacity: 0;
}
</style>
