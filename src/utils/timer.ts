import { enqueuePersistedNotification } from '@renderer/tauri/notification-api'
import {
  getNoteCardList,
  modifyNoteCard,
  NoteCardModel,
  setNoteCardList,
} from '@renderer/tauri/store-api'
import dayjs from 'dayjs'
import emitter from '@renderer/utils/emitter'

const timerIdList: ReturnType<typeof setTimeout>[] = []

// 判断当前时间是否已超过目标时间（今天）
export const isTimePassedToday = (targetTime: string): boolean => {
  const now = dayjs()
  const target = dayjs(targetTime, 'HH:mm')
  return now.isAfter(target) // 当前时间 > 目标时间
}

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

// delay 格式化
export const formatDelay = (ms: number) => {
  const totalMinutes = Math.floor(ms / (1000 * 60)) // 总分钟数（向下取整）
  const hours = String(Math.floor(totalMinutes / 60))
  const minutes = String(totalMinutes % 60).padStart(2, '0')
  if (hours === '0') {
    return `${minutes}分钟后`
  } else {
    return `${hours}小时${minutes}分钟后`
  }
}

const startDailyLoop = async (item: NoteCardModel) => {
  const scheduleNext = () => {
    let target = dayjs(item.timePicker, 'HH:mm')
    if (target.isBefore(dayjs())) target = target.add(1, 'day')
    const delay = target.diff(dayjs())
    addTimer(async () => {
      const nextTarget = dayjs(item.timePicker, 'HH:mm')
        .add(1, 'day')
        .diff(dayjs())
      await enqueuePersistedNotification(
        '便签定时通知',
        '便签：「' +
          item.title +
          '」已到达设定时间\n下次通知时间：' +
          formatDelay(nextTarget)
      )
      emitter.emit('notification-over')
      scheduleNext()
    }, delay)
  }
  scheduleNext()
}

const startOnce = async (item: NoteCardModel) => {
  let target = dayjs(item.timePicker, 'HH:mm')
  if (target.isBefore(dayjs())) target = target.add(1, 'day')
  const delay = target.diff(dayjs())
  addTimer(async () => {
    item.notification = 'none'
    item.timePicker = '00:00'
    await modifyNoteCard(item)
    await enqueuePersistedNotification(
      '便签定时通知',
      '便签：「' + item.title + '」已到达设定时间'
    )
    emitter.emit('notification-over')
  }, delay)
}

// 注册通知事件 目前是直接查询整个便签列表进行注册
export const registerNoteCardTimerTask = async () => {
  clearTimer()
  const list: NoteCardModel[] = await getNoteCardList()
  list.forEach(async (item) => {
    if (item.notification === 'none') return
    // 过期暂时未进行处理
    if (item.notification === 'once') {
      await startOnce(item)
    } else {
      await startDailyLoop(item)
    }
  })
  await setNoteCardList(list)
}
