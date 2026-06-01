import { load } from '@tauri-apps/plugin-store'

const settingStore = await load('setting.json')

export const initialStore = async () => {
  if ((await settingStore.keys()).length === 0) {
    settingStore.set('id', 'BakaQR')
  }
}
