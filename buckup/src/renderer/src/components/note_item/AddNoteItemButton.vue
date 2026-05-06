<template>
  <div class="body_AddNoteItemButton" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="menu_AddNoteItemButton" :class="{ menuExpand: isMouseEnter }">
      <div class="addNoteItemOption_AddNoteItemButton" @click="emit('addNoteItemOptionEvent')">
        添加便签
      </div>
      <!-- <div class="addNoteItemOption_CreateNoteItemButton">添加便签</div> -->
    </div>
    <div class="addButton_AddNoteItemButton">
      <img ref="addIcon" class="addIcon_AddNoteItemButton" :class="{ iconRotate: isMouseEnter }" />
    </div>

    <div class="option_AddNoteItemButton"></div>
  </div>
</template>

<script setup lang="ts">
import addIconUrl from '@renderer/assets/svg/Icon/AddIcon.svg'
import { onMounted, ref } from 'vue'
import {
  color_BrandPrimaryColor,
  color_Light_BackgroundColor,
  color_ExtralightFill,
  color_DarkFill
} from '@renderer/utils/color'

const addIcon = ref<HTMLImageElement>()
const isMouseEnter = ref(false)

onMounted(() => {
  if (addIcon.value) addIcon.value.src = addIconUrl
})

const emit = defineEmits(['addNoteItemOptionEvent'])

const onMouseEnter = () => {
  isMouseEnter.value = true
}

const onMouseLeave = () => {
  isMouseEnter.value = false
}
</script>

<style scoped lang="scss">
$iconSize: 30px;
$iconRadius: 50%;
$buttonMenuItemHeight: 35px;
$buttonMenuHeight: $buttonMenuItemHeight * 1 + 6; // 每一个 item 就多乘一倍 多加6点边框大小

.body_AddNoteItemButton {
  display: inline-block;
  z-index: 5;
}

.addButton_AddNoteItemButton {
  background-color: v-bind(color_BrandPrimaryColor);
  width: $iconSize + 10px;
  height: $iconSize + 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $iconRadius;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.addIcon_AddNoteItemButton {
  width: $iconSize;
  height: $iconSize;
  transition: all 0.2s;
}

.menu_AddNoteItemButton {
  position: absolute;
  transition: all 0.2s;
  transform: translate(-100%, -100%);
  width: 0px;
  height: 0px;
  padding: 0px;
  border: 2px solid v-bind(color_BrandPrimaryColor);
  border-radius: 10px;
  overflow: hidden;
  left: 20px;
  top: 20px;
  // z轴为 -1 时才会被 background-color 遮挡
  z-index: -1;
  background-color: v-bind(color_Light_BackgroundColor);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.addNoteItemOption_AddNoteItemButton {
  position: relative;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  width: 100px;
  height: $buttonMenuItemHeight;
  line-height: $buttonMenuItemHeight;
  transition: all 0.2s;
  cursor: pointer;
  padding-left: 12px;

  &:hover {
    background-color: v-bind(color_ExtralightFill);
  }
  &:active {
    background-color: v-bind(color_DarkFill);
  }
}

.iconRotate {
  transform: rotate(90deg);
}

.menuExpand {
  width: 100px;
  height: $buttonMenuHeight;
}
</style>
