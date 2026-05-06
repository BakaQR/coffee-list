import { Data_NoteItem, Data_NoteItems } from '@renderer/utils/dataStoreInterface'
import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'

const viewName = 'Pinia-Home'

export const useCompHomeStore = defineStore('homeStore', () => {
  // 从文件中读取后存储的所有便签列表
  const noteItemsList = ref<Data_NoteItem[]>([])

  // 刷新仓库中 noteItemsList 保存的数据 从主线程中获取本地文件中的数据
  const reloadNoteItemsData = () => {
    window.electron.ipcRenderer.invoke('getNoteItems').then(async (_res: Data_NoteItems) => {
      if (_res) {
        noteItemsList.value = _res.list
        console.log(`[${viewName}] ` + 'Reload note items data success:')
        // console.dir(noteItemsList.value)
      } else {
        console.log(`[${viewName}] ` + 'Failed to reload note items data')
      }
    })
  }

  // 输入 Data_NoteItem[] 类型的数据 覆写更新本地文件
  const updateNoteItems = (list: Data_NoteItem[]) => {
    list = JSON.parse(JSON.stringify(toRaw(list)))
    // console.log(list)
    window.electron.ipcRenderer.invoke('setNoteItems', list).then((_res: boolean) => {
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
