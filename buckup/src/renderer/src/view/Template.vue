<template>
  <div class="mainDiv">
    <h1>测试页</h1>
    <el-text class="introduction">专门存放测试用的模板</el-text>
    <RouterLink to="/">to home page</RouterLink>
    <img ref="logoImg" class="logoImg" />
    <el-button type="primary" @click="toggleTheme">切换主题</el-button>
    <Edit class="img_edit" />
    <el-switch v-model="themeSwitch" class="themeSwitch" @change="toggleTheme" />
    <el-button type="primary" @click="saveData">存储数据</el-button>
    <el-button type="primary" @click="getData">获取数据</el-button>
    <el-button type="primary" @click="addNoteItem">添加便签</el-button>
    <el-button type="primary" @click="getNoteItem">获取便签数组</el-button>
    <InputNormal v-model="testInputValue"></InputNormal>
    <VueDraggable
      v-model="dragList"
      class="grid-container"
      item-key="id"
      :animation="150"
      ghost-class="ghost-item"
      :force-fallback="true"
    >
      <div v-for="item in dragList" :key="item.id" class="grid-item">
        {{ item.name }}
      </div>
    </VueDraggable>
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
import { Data_Setting, Data_NoteItem, Data_NoteItems } from '@renderer/utils/dataStoreInterface'
import InputNormal from '@renderer/components/InputNormal.vue'
import { VueDraggable } from 'vue-draggable-plus'

const logoImg = ref<HTMLImageElement>()
const testInputValue = ref('')
const dragList = ref([
  { id: 1, name: 'test1' },
  { id: 2, name: 'test2' },
  { id: 3, name: 'test3' },
  { id: 3, name: 'test4' },
  { id: 3, name: 'test5' },
  { id: 3, name: 'test6' }
])

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

const saveData = (): void => {
  console.log('save data ...')
}
const getData = async (): Promise<void> => {
  await window.electron.ipcRenderer
    .invoke('getDataByFileName', 'setting')
    .then((_res: Data_Setting) => {
      if (_res !== null) {
        console.log(_res.fileName + ' ' + _res.windowPositionX + ' ' + _res.windowPositionY)
      } else {
        console.error('config file not exist!')
      }
    })
}

const addNoteItem = () => {
  let testNoteItem: Data_NoteItem = {
    id: '1',
    title: '测试便签对象',
    content: '',
    hasLimitedTime: false
  }
  window.electron.ipcRenderer.invoke('addNoteItem', testNoteItem).then((_res: boolean) => {
    console.log(_res)
  })
}
const getNoteItem = () => {
  window.electron.ipcRenderer.invoke('getNoteItems').then((_res: Data_NoteItems) => {
    if (_res) {
      console.log(_res.list)
    } else {
      console.log(_res)
    }
  })
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
