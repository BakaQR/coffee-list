// 从 tauri/store-api 中获取数据并更新到 pinia 仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  NoteCardModel,
  getNoteCardList,
  setNoteCardList,
} from '@renderer/tauri/store-api'
import emitter from '@renderer/utils/emitter'

export const useNoteCardStore = defineStore('note-card-store', () => {
  const list = ref<NoteCardModel[]>([])

  const updateNoteCardList = async () => {
    list.value = await getNoteCardList()
  }

  const saveNoteCardList = async (list: NoteCardModel[] | undefined) => {
    if (list !== undefined) await setNoteCardList(list)
    await updateNoteCardList()
  }

  const addNoteCard = async (item: NoteCardModel) => {
    list.value.push(item)
    saveNoteCardList(list.value)
  }

  const deleteNoteCard = async (id: string) => {
    list.value = list.value.filter((item) => item.id !== id)
    saveNoteCardList(list.value)
  }

  const updateNoteCard = async (item: NoteCardModel) => {
    const i = list.value.find((i) => i.id === item.id)
    if (i) {
      Object.assign(i, item)
      saveNoteCardList(list.value)
    } else {
      console.log('更新 note card 出错: ', item)
    }
  }

  emitter.on('notification-over', updateNoteCardList)

  return {
    list,
    updateNoteCardList,
    saveNoteCardList,
    addNoteCard,
    deleteNoteCard,
    updateNoteCard,
  }
})
