import { enable, disable } from '@tauri-apps/plugin-autostart'
import { getSettingOptions } from './store-api'

export const updateAutoStartState = async () => {
  const options = await getSettingOptions()
  if (!options) return

  if (options.autoStart) {
    await enable()
  } else {
    disable()
  }
}
