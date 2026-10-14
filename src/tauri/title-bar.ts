import { getCurrentWindow } from '@tauri-apps/api/window'
import { getSettingOptions } from './store-api'

const appWindow = getCurrentWindow()
appWindow.onCloseRequested(async (e) => {
  const options = await getSettingOptions()

  if (options?.minimize && options?.showTray) {
    e.preventDefault()
    await appWindow.hide()
  }
})
