// 全局组件所用数据

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Data_ContextMenu } from '@renderer/utils/dataStoreInterface'

// 覆盖层 (CoverLayout.vue)
export const useCompCoverStore = defineStore('compCoverStore', () => {
  const isShow = ref(false)
  const enable = () => {
    isShow.value = true
  }
  const disable = () => {
    isShow.value = false
  }

  // 默认点击方法
  const defaultClickFunction = () => {
    console.log('cover layout click function undefined')
  }
  // 可自定义的点击方法 每次使用后都会重置为普通方法
  let clickFunction = defaultClickFunction
  const defineClickFunction = (func: () => void) => {
    clickFunction = func
  }
  const useClickFunction = () => {
    clickFunction()
    if (clickFunction !== defaultClickFunction) clickFunction = defaultClickFunction
  }

  return {
    isShow,
    enable,
    disable,
    defineClickFunction,
    useClickFunction
  }
})

// 侧边栏 (AsideMenu.vue)
export const useCompAsideMenuStore = defineStore('compAsideMenuStore', () => {
  const isShow = ref(false)
  const enable = () => {
    isShow.value = true
  }
  const disable = () => {
    isShow.value = false
  }

  return {
    isShow,
    enable,
    disable
  }
})

// Home_创建便签 (CreateNoteItem.vue)
export const useCompCreateNoteItemStore = defineStore('compCreateNoteItemStore', () => {
  const isShow = ref(false)
  const enable = () => {
    isShow.value = true
  }
  const disable = () => {
    isShow.value = false
  }

  return {
    isShow,
    enable,
    disable
  }
})

// 上下文菜单 (ContextMenu.vue)
export const useCompContextMenuStore = defineStore('compContextMenuStore', () => {
  const isShow = ref(false)
  const enable = () => {
    isShow.value = true
  }
  const disable = () => {
    isShow.value = false
  }

  // 选项名称 选项图标URL 触发函数
  const options = ref<Data_ContextMenu>()
  const updateOptionsData = (value: Data_ContextMenu) => {
    options.value = value
  }

  // 显示坐标位置
  const position = ref({ x: 0, y: 0 })
  const updatePosition = (x: number, y: number) => {
    position.value.x = x
    position.value.y = y
  }

  // 确定触发上下文菜单的元素
  const targetElement = ref()
  const setTargetElement = (el: Element) => {
    targetElement.value = el
  }

  return {
    isShow,
    enable,
    disable,
    options,
    updateOptionsData,
    position,
    updatePosition,
    targetElement,
    setTargetElement
  }
})

// 便签详情页 (NoteItemDetail.vue)
export const useCompNoteItemDetailStore = defineStore('compNoteItemDetailStore', () => {
  const isShow = ref(false)
  const enable = () => {
    isShow.value = true
  }
  const disable = () => {
    isShow.value = false
  }
  const title = ref('')
  const setTitle = (str: string) => {
    title.value = str
  }
  const content = ref('')
  const setContent = (str: string) => {
    content.value = str
  }

  return {
    isShow,
    enable,
    disable,
    title,
    setTitle,
    content,
    setContent
  }
})

// 便签编辑页 (EditNoteItem.vue)
export const useCompEditNoteItemStore = defineStore('compEditNoteItemStore', () => {
  const isShow = ref(false)
  const enable = () => {
    isShow.value = true
  }
  const disable = () => {
    isShow.value = false
  }
  const id = ref('')
  const setId = (str: string) => {
    id.value = str
  }
  const title = ref('')
  const setTitle = (str: string) => {
    title.value = str
  }
  const content = ref('')
  const setContent = (str: string) => {
    content.value = str
  }
  const check = ref(false)
  const setCheck = (b: boolean) => {
    check.value = b
  }
  const notificationOptions = ref('')
  const setNotificationOptions = (str: string) => {
    notificationOptions.value = str
  }

  return {
    isShow,
    enable,
    disable,
    id,
    setId,
    title,
    setTitle,
    content,
    setContent,
    check,
    setCheck,
    notificationOptions,
    setNotificationOptions
  }
})
