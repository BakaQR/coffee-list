import { load } from '@tauri-apps/plugin-store'

// 设置
const storeSettings = await load('setting.json')
// 便签卡片数据集
const storeNoteCards = await load('noteCard.json')

// 数据初始化
export const initialStore = async () => {
  if ((await storeSettings.keys()).length === 0) {
    storeSettings.set('id', 'BakaQR')
  }
  if ((await storeNoteCards.keys()).length === 0) {
    storeNoteCards.set('list', [
      {
        id: 9999,
        title: '默认标题',
        content: '默认内容',
      },
    ])
  }
}

// 便签卡片数据类型
export interface I_NoteCard {
  id: number
  title: string
  content: string
}
export const getNoteCardList = async () => {
  return storeNoteCards.get('list') as unknown as I_NoteCard[]
}
export const setNoteCardList = async (list: I_NoteCard[]) => {
  await storeNoteCards.set('list', list)
}
