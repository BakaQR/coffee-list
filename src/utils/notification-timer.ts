import { enqueuePersistedNotification } from '@renderer/tauri/notification-api'
import {
  getNoteCardList,
  modifyNoteCard,
  NoteCardModel,
} from '@renderer/tauri/store-api'
import dayjs from 'dayjs'
import emitter from '@renderer/utils/emitter'

// 定时器列表
const timerIdList: ReturnType<typeof setTimeout>[] = []

// 添加定时任务
export const addTimer = (callback: () => void, delay: number) => {
  const id = setTimeout(callback, delay) as ReturnType<typeof setTimeout>
  timerIdList.push(id)
  return id
}

// 清除所有定时器
export const clearTimer = () => {
  timerIdList.forEach((id) => clearTimeout(id))
  timerIdList.length = 0
}

const startDailyLoop = async (item: NoteCardModel) => {
  const scheduleNext = () => {
    let target = dayjs(item.timePickerDay, 'HH:mm')
    if (target.isBefore(dayjs())) target = target.add(1, 'day')
    const delay = target.diff(dayjs())
    addTimer(async () => {
      await enqueuePersistedNotification(
        '便签定时通知',
        '便签：「' + item.title + '」已到达设定时间'
      )
      emitter.emit('notification-over')
      scheduleNext()
    }, delay)
  }
  scheduleNext()
}

const startOnce = async (item: NoteCardModel) => {
  const target = dayjs(item.timePickerOnce, 'YYYY-MM-DD HH:mm')
  const delay = target.diff(dayjs())
  console.log(`一次性通知: ${delay}`)
  addTimer(async () => {
    item.notification = 'none'
    item.timePickerOnce = ''
    await modifyNoteCard(item)
    await enqueuePersistedNotification(
      '便签定时通知',
      '便签：「' + item.title + '」已到达设定时间'
    )
    emitter.emit('notification-over')
  }, delay)
}

// 注册通知事件 目前是直接查询整个便签列表覆盖注册
export const registerNoteCardTimerTask = async () => {
  clearTimer()
  const list: NoteCardModel[] = await getNoteCardList()

  for (const item of list) {
    if (item.notification === 'none') continue
    if (item.notification === 'once') await startOnce(item)
    if (item.notification === 'day') await startDailyLoop(item)
  }
}

// 清除所有便签的通知及定时器
export const clearNoteCardTimerTask = async () => {
  clearTimer()
  const list: NoteCardModel[] = await getNoteCardList()

  for (const item of list) {
    item.notification = 'none'
    item.timePickerDay = ''
    item.timePickerOnce = ''
    await modifyNoteCard(item)
    console.log(item)
  }

  // 更新 pinia 中的便签列表
  emitter.emit('note-card-list-update')
}
