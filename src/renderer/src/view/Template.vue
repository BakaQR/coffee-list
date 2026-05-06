<template>
  <div class="mainDiv">
    <h1>测试页</h1>
    <el-text class="introduction">专门存放测试用的模板</el-text>
    <RouterLink to="/">to home page</RouterLink>
    <img ref="logoImg" class="logoImg" />
    <el-button type="primary" @click="toggleTheme">切换主题</el-button>
    <Edit class="img_edit" />
    <el-switch v-model="themeSwitch" class="themeSwitch" @change="toggleTheme" />夜间模式（未适配）
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  color_Dark_BackgroundColor,
  color_Dark_TextPrimaryColor,
  color_Dark_TextRegularColor,
  color_Light_BackgroundColor,
  color_Light_PrimaryColor,
  color_Light_RegularColor,
  color_BaseFill
} from '@renderer/utils/color'

import logoURL from '@renderer/assets/svg/Logo.svg'

const logoImg = ref<HTMLImageElement>()

onMounted(() => {
  if (logoImg.value) logoImg.value.src = logoURL
})

// 给input元素屏蔽拖拽放下事件
// const handleInputDrop = (event): void => {
//   event.preventDefault()
// }

const themeSwitch = ref(true)
const toggleTheme = (): void => {
  window.electron.ipcRenderer.send('toggleTheme')
}
</script>

<style scoped lang="scss">
$a: 40px;

.logoImg,
.img_edit {
  width: $a;
  display: block;
}

.noteItemDiv {
  transition: all 0.2s;
  padding: 10px 15px;
  display: flex;
  flex-wrap: wrap;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}
.grid-item {
  width: 100px;
  height: 100px;
  background: aqua;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ghost-item {
  opacity: 0.6;
  background: #c8ebfb !important;
}

@media (prefers-color-scheme: dark) {
  div {
    background-color: v-bind(color_Dark_BackgroundColor);

    h1 {
      color: v-bind(color_Dark_TextPrimaryColor);
    }
    .introduction {
      --el-text-color-regular: v-bind(color_Dark_TextRegularColor);
    }
  }
}

@media (prefers-color-scheme: light) {
  div {
    background-color: v-bind(color_Light_BackgroundColor);

    h1 {
      color: v-bind(color_Light_PrimaryColor);
    }
    .introduction {
      --el-text-color-regular: v-bind(color_Light_RegularColor);
    }
  }
}

.mainDiv {
  width: 100%;
  height: 100%;
}

.themeSwitch {
  --el-switch-off-color: v-bind(color_BaseFill);
}

* {
  transition: all 0.45s;
}
</style>
