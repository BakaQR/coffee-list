// 从 tauri/store-api 中获取数据并更新到 pinia 仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  I_NoteCard,
  getNoteCardList,
  setNoteCardList,
} from '@renderer/tauri/store-api'

export const useNoteCardStore = defineStore('note-card-store', () => {
  const list = ref<I_NoteCard[]>([])

  const updateNoteCardList = async () => {
    list.value = await getNoteCardList()
  }

  const saveNoteCardList = async (list: I_NoteCard[] | undefined) => {
    if (list !== undefined) await setNoteCardList(list)
    await updateNoteCardList()
  }

  const addNoteCard = async (item: I_NoteCard) => {
    list.value.push(item)
    saveNoteCardList(list.value)
  }

  const deleteNoteCard = async (id: string) => {
    list.value = list.value.filter((item) => item.id !== id)
    saveNoteCardList(list.value)
  }

  return {
    list,
    updateNoteCardList,
    saveNoteCardList,
    addNoteCard,
    deleteNoteCard,
  }
})
