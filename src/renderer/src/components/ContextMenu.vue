<template>
  <transition name="fadeAnim">
    <div
      v-if="compContextMenuStore.isShow"
      v-click-outside="clickOutside"
      class="menuContainer_ContextMenu"
    >
      <ul class="ul_ContextMenu">
        <!-- 此处直接使用 pinia 仓库中的数据 -->
        <li
          v-for="(option, index) in compContextMenuStore.options?.optionsList"
          :key="index"
          class="menuOption_ContextMenu"
          @click="compContextMenuStore.options?.optionsClickFunction[index]"
        >
          <IconTransition
            :size="'20px'"
            :icon-url="compContextMenuStore.options?.optionsUrl[index]"
          ></IconTransition>
          <span>{{ option }}</span>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script setup lang="ts">
// 该组件应为全局唯一 放置于 #app 模板下
// 该组件默认是使用 v-if 进行隐藏 需要在外部组件调用 useCompContextMenuStore 中的 enable() 进行激活
// 激活后上下文菜单才响应关闭菜单事件
// 在激活之前 需要在其他组件中给 useCompContextMenuStore 传入显示坐标、选项名称、选项事件、触发元素
// 在点击事件 event 中获取相关点击坐标 更新上下文菜单显示位置
// compContextMenuStore.updatePosition(event.clientX, event.clientY)
// 设置点击到的元素 用于判断下次点击是否还是该元素 如果不是该元素则关闭上下文菜单
// compContextMenuStore.setTargetElement(event.target as Element)
// 设置上下文菜单的选项 contextMenuOptions: Data_ContextMenu = { optionsList: ..., optionsClickFunction: ..., optionsUrl: ...}
// compContextMenuStore.options = contextMenuOptions
// 显示上下文菜单
// compContextMenuStore.enable()

// 导入指令 ClickOutside 会对点击该元素以外的区域回调事件
// vue3会自动把驼峰式命名自动转为-分割
// 因此命名变量 vClickOutside 会转化为指令 v-click-outside
import { ClickOutside } from 'element-plus'
const vClickOutside = ClickOutside

import { computed } from 'vue'
import {
  color_BrandPrimaryColor,
  color_Light_BackgroundColor,
  color_ExtralightFill
} from '@renderer/utils/color'
import { useCompContextMenuStore } from '@renderer/pinia/store/GlobalComponentData'
import IconTransition from './IconTransition.vue'
const compContextMenuStore = useCompContextMenuStore()

// 用于 css
const posX = computed(() => `${compContextMenuStore.position.x + 5}px`)
const posY = computed(() => `${compContextMenuStore.position.y + 5}px`)

// 点击到菜单以外的元素时关闭菜单
const clickOutside = (event: MouseEvent) => {
  if (event.button === 0) {
    compContextMenuStore.disable()
  } else if (event.button === 2) {
    if (event.target === compContextMenuStore.targetElement) {
      // compContextMenuStore.enable()
    } else {
      compContextMenuStore.disable()
    }
  } else {
    compContextMenuStore.disable()
  }
}
</script>

<style scoped lang="scss">
.menuContainer_ContextMenu {
  position: absolute;
  width: auto;
  min-width: 90px;
  z-index: 8;
  border: 1px solid v-bind(color_BrandPrimaryColor);
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  white-space: nowrap;

  left: v-bind(posX);
  top: v-bind(posY);
}

.ul_ContextMenu {
  li {
    list-style-type: none;
    display: flex;
    align-items: center;
    padding: 6px 0px 6px 10px;
    background-color: v-bind(color_Light_BackgroundColor);
    transition: all 0.2s;

    &:hover {
      cursor: pointer;
      background-color: v-bind(color_ExtralightFill);
    }
  }
  span {
    margin-left: 10px;
  }
}

.fadeAnim-enter-active,
.fadeAnim-leave-active {
  transition: opacity 0.2s;
}

.fadeAnim-enter-from,
.fadeAnim-leave-to {
  opacity: 0;
}
</style>
