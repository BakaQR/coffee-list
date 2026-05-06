// 用于格式化获取当天的时间

export const getNowDateFormatYYYYMD = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份从0开始需+1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}
