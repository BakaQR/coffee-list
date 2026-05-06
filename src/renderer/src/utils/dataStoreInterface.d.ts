// ./src/main/utils/data_store 用于规范从主线程获取的数据类型 此处使用接口

export interface Data_Base {
  fileName: string
}

// 设置
export interface Data_Setting extends Data_Base {
  fileName: string
  windowPositionX: number
  windowPositionY: number
  windowBoundsWidth: number
  windowBoundsHeight: number
  themeSource: 'light' | 'dark'
}

// 便签对象
export interface Data_NoteItem {
  id: string
  title: string
  content: string
  check: boolean
  notificationOptions: string
  // hasLimitedTime?: boolean
  // dateFrom?: string
  // dateTo?: string
}

// 便签对象数据集
export interface Data_NoteItems extends Data_Base {
  fileName?: string
  list: Data_NoteItem[]
}

// 上下文菜单选项对象
// 在可以被右键点击弹出上下文菜单的组件中使用
export interface Data_ContextMenu {
  optionsList: string[]
  optionsClickFunction: (() => void)[]
  optionsUrl: string[]
}

// 主线程修改 settings 的对象
export class Data_RendererModifySettingsObject {
  name: string = 'default'
  value: unknown = 'default'
}

// 设置选项
export class Data_Settings {
  isMinimize: boolean = false
}
