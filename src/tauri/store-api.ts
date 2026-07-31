import { load } from '@tauri-apps/plugin-store'
import { nanoid } from 'nanoid'
import { updateTrayState } from './tray-manager'

// 设置
const storeSettings = await load('settings.json')
// 便签卡片数据集
const storeNoteCards = await load('note-card.json')

// 数据初始化
export const initialStore = async () => {
  if ((await storeSettings.keys()).length === 0) {
    await initialSettingData()
  }
  if ((await storeNoteCards.keys()).length === 0) {
    await initialNoteCardData()
  }
}

// 设置
export interface SettingOptionsModel {
  iconTooltip: boolean
  showTray: boolean
  minimize: boolean
}
const SETTINGOPTIONS = 'setting-options'
export const getSettingOptions = async () => {
  return await storeSettings.get<SettingOptionsModel>(SETTINGOPTIONS)
}
export const setSettingOptions = async (option: SettingOptionsModel) => {
  await storeSettings.set(SETTINGOPTIONS, option)
  setOver()
}
// 用于执行数据更新后非渲染线程相关操作
const setOver = () => {
  updateTrayState()
}
const initialSettingData = async () => {
  const init: SettingOptionsModel = {
    iconTooltip: true,
    showTray: true,
    minimize: false,
  }
  setSettingOptions(init)
}

// 便签卡片数据
export interface NoteCardModel {
  id: string
  title: string
  content: string
  isCheck: boolean
}
export const getNoteCardList = async () => {
  return (await storeNoteCards.get('list')) as unknown as NoteCardModel[]
}
export const setNoteCardList = async (list: NoteCardModel[]) => {
  await storeNoteCards.set('list', list)
}
export const addNoteCard = async (item: NoteCardModel) => {
  const list = await getNoteCardList()
  list.push(item)
}
const initialNoteCardData = async () => {
  await storeSettings.set('id', 'note-card-list')
  // 默认便签数据
  await storeNoteCards.set('list', [
    {
      id: nanoid(10),
      title: '默认便签',
      content: '便签下方是功能区按钮\n可以左键拖动便签调整位置',
      isCheck: false,
    },
  ])
}
