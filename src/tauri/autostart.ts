import { enable, disable } from '@tauri-apps/plugin-autostart'
import { getSettingOptions } from './store-api'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { getMatches } from '@tauri-apps/plugin-cli'

export const updateAutoStartState = async () => {
  const options = await getSettingOptions()
  if (!options) return

  if (options.autoStart) {
    await enable()
  } else {
    disable()
  }
}

export const silentStart = async () => {
  const options = await getSettingOptions()
  if (!options) return

  const cliMatches = await getMatches()
  const appWindow = getCurrentWindow()
  if (cliMatches.args['autostart'].value) {
    if (options.minimize) {
      appWindow.hide()
    } else {
      appWindow.unminimize()
      appWindow.show()
    }
  } else {
    appWindow.unminimize()
    appWindow.show()
  }
}
