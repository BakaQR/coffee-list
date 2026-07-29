import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'

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
  sendNotification({ title, body })
  return true
}
