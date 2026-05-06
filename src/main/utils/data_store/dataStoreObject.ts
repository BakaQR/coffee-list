// 提供配置文件的默认值以及数据类型

import { checkConfigFileExist, saveData } from './dataStoreAPI'

export interface Data_Base {
  fileName: string
}

export class Data_FileManager {
  // 提供配置文件的名称用于直接读取判断配置文件是否存在
  static nSetting = 'setting'
  static nNoteItems = 'noteitems'

  // 初始化配置文件生成 每一个配置文件都需要添加到此初始化生成
  static initialConfigFiles = (): void => {
    if (!checkConfigFileExist(this.nSetting)) saveData(new Data_Setting())
    if (!checkConfigFileExist(this.nNoteItems)) saveData(new Data_NoteItems())
  }
}

// 设置
export class Data_Setting implements Data_Base {
  fileName: string = Data_FileManager.nSetting
  windowPositionX: number = 100
  windowPositionY: number = 100
  windowBoundsWidth: number = 500 + 14
  windowBoundsHeight: number = 500 + 7
  themeSource: 'light' | 'dark' = 'light'

  // Setting.vue 可配置选项
  isMinimize: boolean = false
}

// 便签对象
export class Data_NoteItem {
  id: string = '10000'
  title: string = '默认便签'
  content: string = '默认便签内容默认便签内容默认便签内容默认便签内容'
  check: boolean = true
  notificationOptions: string = 'none'
}

// 便签对象数据集
export class Data_NoteItems implements Data_Base {
  fileName: string = Data_FileManager.nNoteItems
  list: Data_NoteItem[] = [new Data_NoteItem()]
}

export class Data_RendererModifySettingsObject {
  name: string = 'default'
  value: unknown = 'default'
}
