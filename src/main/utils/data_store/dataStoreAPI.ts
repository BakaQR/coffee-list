// 用于保存文件到磁盘上 从磁盘读取文件
// 暂时没有做数据验证 如果从程序外部修改了配置文件 也会直接读取 没有验证数据是否合理
// 可以从外部直接删除配置文件的目录 恢复默认值

import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import fs from 'fs'
import { Data_Base } from './dataStoreObject'

// 存储数据对象 转为 json 格式后保存到 config 目录中
export const saveData = (dataObj: Data_Base): void => {
  fs.writeFileSync(
    join(getConfigPath(), dataObj.fileName + '.json'),
    JSON.stringify(dataObj, null, 2),
    'utf-8'
  )
}

// 读取数据对象 从 config 中读取对应文件名保存的数据 并转为 json 格式对象
export const getData = (fileName: string): Data_Base => {
  return JSON.parse(fs.readFileSync(join(getConfigPath(), fileName + '.json'), 'utf-8'))
}

// 检查配置文件是否存在
export const checkConfigFileExist = (fileName: string): boolean => {
  if (fs.existsSync(join(getConfigPath(), fileName + '.json'))) {
    return true
  } else {
    return false
  }
}

// 获取配置文件保存的路径
const getConfigPath = (): string => {
  let configPath: string = ''
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // 开发环境中每次启动都会重置文件夹 此处直接让 config 文件夹放置在工作目录下
    let temp = __dirname.split('\\')
    temp = temp.slice(0, temp.length - 2)
    temp.push('out_config')
    configPath = temp.join().replaceAll(',', '\\')
    // 开发环境 .\coffee-do-list\out_config\
  } else {
    let temp = __dirname.split('\\')
    temp = temp.slice(0, temp.length - 3)
    temp.push('config')
    configPath = temp.join().replaceAll(',', '\\')
    // 发布环境 .\coffee-do-list\resources\config\
  }
  if (!fs.existsSync(configPath)) fs.mkdirSync(configPath)
  return configPath
}
