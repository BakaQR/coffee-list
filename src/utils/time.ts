import dayjs from 'dayjs'

// 禁用过去的日期
export const disabledDate = (time: Date) => {
  const today = new Date()
  // 将今天的时分秒归零，这样"今天"是可选的
  today.setHours(0, 0, 0, 0)
  return time.getTime() < today.getTime()
}

// 如果选中的是"今天"，禁用已经过去的小时
export const disabledHours = () => {
  const now = new Date()
  const currentHour = now.getHours()
  // 返回一个数组，包含从 0 到 currentHour - 1 的所有小时
  return Array.from({ length: currentHour }, (_, i) => i)
}

// 如果选中的是"今天"且是"当前小时"，禁用已经过去的分钟
export const disabledMinutes = (hour: number) => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // 只有当选择的小时等于当前小时时，才禁用过去的分钟
  if (hour === currentHour) {
    // 返回一个数组，包含从 0 到 currentMinute - 1 的所有分钟
    return Array.from({ length: currentMinute }, (_, i) => i)
  }
  return []
}

// 判断当前时间是否已超过目标时间
export const isTimePassedToday = (timeStr: string): boolean => {
  const now = dayjs()
  const target = dayjs(timeStr, 'YYYY-MM-DD HH:mm')
  return target.isBefore(now, 'minute')
}
