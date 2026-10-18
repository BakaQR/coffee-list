import {
  isPermissionGranted,
  requestPermission,
  // sendNotification,
} from '@tauri-apps/plugin-notification'
import { getSettingOptions } from '@renderer/tauri/store-api'
import { invoke } from '@tauri-apps/api/core'

const checkPermission = async () => {
  if (!(await isPermissionGranted())) {
    return (await requestPermission()) === 'granted'
  }
  return true
}

export const enqueuePersistedNotification = async (
  title: string,
  body: string
) => {
  if (!(await checkPermission())) {
    console.log('无通知权限')
    return false
  }
  const options = await getSettingOptions()

  const sound = options?.notificationSound ? 'Default' : undefined

  // 插件实现的通知无法持久化，很容易就漏了
  // 现在改成使用 rust 中命令发起 scenario="reminder" 的 toast
  // sendNotification({ title: title, body: body, sound: sound })
  await invoke('notify_sticky', {
    title: title,
    body: body,
    sound: sound,
  })

  return true
}
