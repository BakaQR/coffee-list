import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'
import { getSettingOptions } from '@renderer/tauri/store-api'

const checkPermission = async () => {
  if (!(await isPermissionGranted())) {
    return (await requestPermission()) === 'granted'
  }
  return true
}

export const enqueueNotification = async (title: string, body: string) => {
  if (!(await checkPermission())) {
    console.log('无通知权限')
    return false
  }
  const options = await getSettingOptions()
  if (!options) return

  let sound = ''
  if (options.notificationSound) sound = 'Default'
  sendNotification({ title: title, body: body, sound: sound })
  return true
}
