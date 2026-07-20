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

  return {
    list,
    updateNoteCardList,
    saveNoteCardList,
  }
})
