<template>
  <div
    class="TopContainer"
    :class="{ hasActiveBackgroundAnim: props.backgroundAnim, hasRotateAnim: rotateAnim }"
    @click="onClick"
    @mousedown="onMousedown"
    @mouseup="onMouseup"
  >
    <img ref="iconButton" class="iconImg" :class="{ hasActiveScaleAnim: activeScaleAnim }" />
  </div>
</template>

<script setup lang="ts">
// 拥有icon的按钮
import { computed, onMounted, ref } from 'vue'
import {
  color_Light_BrandHoverColor,
  color_Light_BrandActiveColor,
  color_Dark_BrandHoverColor,
  color_Dark_BrandActiveColor
} from '@renderer/utils/color'

// 默认icon图片
import defaultIcon from '@renderer/assets/svg/Icon/__DefaultIcon.svg'
const iconButton = ref<HTMLImageElement>()

// 父组件传递的数据
const props = defineProps({
  // 鼠标悬停与左键按下激活时的背景颜色变化
  backgroundAnim: Boolean,
  // 鼠标点击时的图标缩放动画
  scaleAnim: Boolean,
  // 鼠标悬停时让图标旋转
  rotateAnim: Boolean,
  // 鼠标悬停时图标旋转角度
  rotateAnimValue: {
    type: String,
    default: '90deg'
  },
  iconUrl: String,
  clickEvent: Function
})

const activeScaleAnim = ref(false)
const rotateAnimValue = computed(() => props.rotateAnimValue)

onMounted(() => {
  if (props.iconUrl === undefined) {
    if (iconButton.value) iconButton.value.src = defaultIcon
  } else {
    if (iconButton.value) iconButton.value.src = props.iconUrl
  }
})

const onClick = () => {
  if (props.clickEvent) {
    props.clickEvent()
  } else {
    console.log('button event undefind')
  }
}

const onMousedown = () => {
  if (props.scaleAnim) {
    activeScaleAnim.value = true
  }
}

const onMouseup = () => {
  if (props.scaleAnim) {
    activeScaleAnim.value = false
  }
}
</script>

<style scoped lang="scss">
$iconSize: 40px;

.TopContainer {
  display: inline-block;
  padding: 0;
  margin: 0;
  width: $iconSize;
  height: $iconSize;
  border-radius: 10%;
  transition: all 0.25s;
}

.iconImg {
  width: 100%;
  height: 100%;
  transition: all 0.25s;
  transform: scale(1, 1);

  &:hover {
    cursor: pointer;
  }
}

@media (prefers-color-scheme: light) {
  .hasActiveBackgroundAnim:hover {
    background-color: v-bind(color_Light_BrandHoverColor);
  }
  .hasActiveBackgroundAnim:active {
    background-color: v-bind(color_Light_BrandActiveColor);
  }
}

@media (prefers-color-scheme: dark) {
  .hasActiveBackgroundAnim:hover {
    background-color: v-bind(color_Dark_BrandHoverColor);
  }
  .hasActiveBackgroundAnim:active {
    background-color: v-bind(color_Dark_BrandActiveColor);
  }
}

.hasActiveScaleAnim:active {
  transform: scale(0.8, 1.2);
}

.hasRotateAnim:hover {
  transform: rotate(v-bind(rotateAnimValue));
}
</style>
