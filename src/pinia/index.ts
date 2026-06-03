import { createPinia } from 'pinia'
import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'

export const pinia = createPinia()

export const initializeStore = async () => {
  await useNoteCardStore().updateNoteCardList()
}
