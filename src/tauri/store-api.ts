import { load } from '@tauri-apps/plugin-store'

const settingStore = await load('setting.json')
const noteCardStore = await load('noteCard.json')

export const initialStore = async () => {
  if ((await settingStore.keys()).length === 0) {
    settingStore.set('id', 'BakaQR')
  }
}

export const getNoteCardList = async () => {
  return noteCardStore.get('list') as unknown as I_NoteCard[]
}

export const setNoteCardList = async (list: I_NoteCard[]) => {
  await noteCardStore.set('list', list)
}

export interface I_NoteCard {
  id: number
  title: string
  content: string
}
