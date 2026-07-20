import { load } from '@tauri-apps/plugin-store'

// 设置
const storeSettings = await load('settings.json')
// 便签卡片数据集
const storeNoteCards = await load('note-card.json')

// 数据初始化
export const initialStore = async () => {
  if ((await storeSettings.keys()).length === 0) {
    await initialSettingsData()
  }
  if ((await storeNoteCards.keys()).length === 0) {
    await initialNoteCardData()
  }
}

// 设置选项
export enum SettingsOptions {
  // 图标文字提示
  IconTooltip = 'icon-tools',
  // 显示托盘
  ShowTray = 'show-tray',
}
export const getSettingsOptions = async (option: SettingsOptions) => {
  return await storeSettings.get<string | boolean | number>(option)
}
export const setSettingsOptions = async (
  option: SettingsOptions,
  value: string | number | boolean
) => {
  await storeSettings.set(option, value)
}
const initialSettingsData = async () => {
  await storeSettings.set('id', 'settings')
  await storeSettings.set(SettingsOptions.IconTooltip, true)
  await storeSettings.set(SettingsOptions.ShowTray, true)
}

// 便签卡片数据
export interface I_NoteCard {
  id: number
  title: string
  content: string
}
export const getNoteCardList = async () => {
  return (await storeNoteCards.get('list')) as unknown as I_NoteCard[]
}
export const setNoteCardList = async (list: I_NoteCard[]) => {
  await storeNoteCards.set('list', list)
}
const initialNoteCardData = async () => {
  await storeSettings.set('id', 'note-card-list')
  // 默认便签数据
  await storeNoteCards.set('list', [
    {
      id: 9999,
      title: '默认便签',
      content: '可以拖动便签调整位置',
    },
  ])
}
