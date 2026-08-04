import { createPinia } from 'pinia'
import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'
import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'

export const pinia = createPinia()

export const initializeStore = async () => {
  // 更新 pinia 仓库数据
  await useNoteCardStore().updateNoteCardList()
  await useSettingsStore().updateSettingData()
}
