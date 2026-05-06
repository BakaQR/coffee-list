// view 页面所用数据仓库

import {
  Data_NoteItem,
  Data_NoteItems,
  Data_RendererModifySettingsObject,
  Data_Settings
} from '@renderer/utils/dataStoreInterface'
import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'

const viewName = 'Pinia-ViewComp'

export const useNoteItemsStore = defineStore('noteItemStore', () => {
  // 从文件中读取后存储的所有便签列表
  const noteItemsList = ref<Data_NoteItem[]>([])

  // 刷新仓库中 noteItemsList 保存的数据 从主线程中获取本地文件中的数据
  const reloadNoteItemsData = () => {
    window.electron.ipcRenderer.invoke('noteItem_get').then(async (_res: Data_NoteItems) => {
      if (_res) {
        noteItemsList.value = _res.list
        console.log(`[${viewName}] ` + 'Reload note items data success')
        // console.dir(noteItemsList.value)
      } else {
        console.log(`[${viewName}] ` + 'Failed to reload note items data')
      }
    })
  }

  // 输入 Data_NoteItem[] 类型的数据 覆写更新本地文件
  const updateNoteItems = async (list: Data_NoteItem[]) => {
    list = JSON.parse(JSON.stringify(toRaw(list)))
    // console.log(list)
    window.electron.ipcRenderer.invoke('noteItem_set', list).then((_res: boolean) => {
      if (_res) {
        console.log(`[${viewName}] ` + 'save note items success')
      } else {
        console.error(`[${viewName}] ` + 'add note item failed !!!')
      }
    })
    reloadNoteItemsData()
  }
  return {
    noteItemsList,
    reloadNoteItemsData,
    updateNoteItems
  }
})

export const useSettingsStore = defineStore('settingsStore', () => {
  const settings = ref<Data_Settings>({
    isMinimize: false
  })

  const reloadSettingsData = () => {
    window.electron.ipcRenderer.invoke('randererGetSettings').then(async (_res: Data_Settings) => {
      if (_res) {
        settings.value.isMinimize = _res.isMinimize
        console.log(`[${viewName}] ` + 'Reload settings data success')
      } else {
        console.log(`[${viewName}] ` + 'Failed to reload settings data')
      }
    })
  }

  const modifySettings = (obj: Data_RendererModifySettingsObject) => {
    window.electron.ipcRenderer
      .invoke('randererModifySettings', obj)
      .then(async (_res: boolean) => {
        if (_res) {
          console.log(
            `[${viewName}] ` + 'setting option name: %c' + obj.name + '%c value : %c' + obj.value,
            'color: red;',
            'color: black;',
            'color: red'
          )
          reloadSettingsData()
        } else {
          console.log('Modify ' + obj + ' failed')
        }
      })
  }
  return {
    settings,
    reloadSettingsData,
    modifySettings
  }
})
