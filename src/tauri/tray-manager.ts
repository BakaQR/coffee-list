import { TrayIcon } from '@tauri-apps/api/tray'
import { getSettingOptions } from './store-api'

export const updateTrayState = async () => {
  const options = await getSettingOptions()

  const tray = await TrayIcon.getById('main')
  if (tray) tray.setVisible(options?.showTray ?? true)
}
