import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  systemPreferences,
  nativeTheme,
  session,
  nativeImage
} from 'electron'
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { getData, saveData, checkConfigFileExist } from './utils/data_store/dataStoreAPI'
import {
  Data_FileManager,
  Data_NoteItem,
  Data_NoteItems,
  Data_RendererModifySettingsObject,
  Data_Setting
} from './utils/data_store/dataStoreObject'
import { Menu, Tray } from 'electron/main'

// devtools 路径
const vueDevToolsPath = join(__dirname, '../../vue_devtools_7.7.0')

const windowDefaultProperty = {
  // 窗口默认尺寸 正常情况用不上
  width: 560 + 14,
  height: 560 + 7,
  // 窗口最小尺寸
  minWidth: 550 + 16,
  minHeight: 530 + 9
}

// 创建系统托盘及菜单
let tray: Tray
import trayIconPath from '../../resources/icon.ico?asset'
const trayIcon = nativeImage.createFromPath(trayIconPath)

// 用于控制关闭程序
let isQuitting = false
let isMinimize = false

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.bakaqr')

  // F12 显示 web 控制台
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ipc 事件
  ipcHandler()

  // 创建窗口
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    width: windowDefaultProperty.width,
    minWidth: windowDefaultProperty.minWidth,
    height: windowDefaultProperty.height,
    minHeight: windowDefaultProperty.minHeight,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      nodeIntegration: true
    }
  })

  // 初始化数据配置文件
  Data_FileManager.initialConfigFiles()

  // 初始化窗口
  windowInitial(mainWindow)

  // 加载完毕时显示窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 创建系统托盘及菜单
  tray = new Tray(trayIcon)
  const trayMenu = Menu.buildFromTemplate([
    {
      label: '打开',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: '退出',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])
  tray.setContextMenu(trayMenu)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    console.log('debug: ' + details)
    return { action: 'deny' }
  })

  // 读取 index.html 文件
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // 开发环境
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    // web 控制台安装 vue devtools
    if (fs.existsSync(vueDevToolsPath)) {
      await session.defaultSession.extensions.loadExtension(vueDevToolsPath)
    }
  } else {
    // 生产环境
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 关闭app进程
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (!isMinimize) app.quit()
  }
})

// 窗口初始化
const windowInitial = (mainWindow: BrowserWindow): void => {
  // 隐藏菜单栏
  mainWindow.setMenuBarVisibility(false)

  // 读取配置文件
  loadDataOnInitial(mainWindow)

  // 监听关闭时的事件
  mainWindow.on('close', (e) => {
    if (isQuitting) {
      // 关闭应用时保存配置文件
      saveDataOnClose(mainWindow)
    } else if (!isMinimize) {
      console.log('close by title bar')
      saveDataOnClose(mainWindow)
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  })
}

// ipc 事件处理
const ipcHandler = (): void => {
  const consoloName = '[IPC Handler]: '

  // 获取系统颜色
  ipcMain.handle('getSystemColor', (_event, colorName) => {
    return systemPreferences.getColor(colorName)
  })

  // 切换颜色主题
  ipcMain.on('toggleTheme', () => {
    const data_Setting = getData(Data_FileManager.nSetting) as Data_Setting
    if (nativeTheme.shouldUseDarkColors) {
      data_Setting.themeSource = 'light'
    } else {
      data_Setting.themeSource = 'dark'
    }
    nativeTheme.themeSource = data_Setting.themeSource
    saveData(data_Setting)
  })

  // 渲染线程获取持久化数据
  ipcMain.handle('getDataByFileName', (_, value) => {
    if (checkConfigFileExist(value)) {
      console.log(`${consoloName}` + 'check file success: ' + value)
      return getData(value)
    } else {
      console.error(`${consoloName}` + 'config file not exist : ' + value)
      return null
    }
  })

  // 从文件中获取note items
  ipcMain.handle('noteItem_get', () => {
    if (checkConfigFileExist(Data_FileManager.nNoteItems)) {
      const noteItems = getData(Data_FileManager.nNoteItems) as Data_NoteItems
      return noteItems
    } else {
      console.error(`${consoloName}` + 'Get note items faild, file not exist')
      return false
    }
  })

  // Home.vue 添加便签 添加成功返回true 失败返回false
  // 传入的变量必须是renderer中的dataStoreInterface.d.ts中声明的 Data_NoteItem 的类型
  // 该类型与 dataStoreObject.ts 中的 Data_NoteItem 对应
  ipcMain.handle('noteItem_add', (_, value: Data_NoteItem) => {
    if (checkConfigFileExist(Data_FileManager.nNoteItems)) {
      console.log(
        `${consoloName}` + 'Add note item to list: id: ' + value.id + ' title: ' + value.title
      )
      const noteItems = getData(Data_FileManager.nNoteItems) as Data_NoteItems
      noteItems.list.push(value)
      saveData(noteItems)
      return true
    } else {
      console.error(
        `${consoloName}` +
          'Add note item faild: ' +
          value +
          '\nFile name note exist: ' +
          Data_FileManager.nNoteItems
      )
      return false
    }
  })

  // 直接通过数组覆写 note items
  ipcMain.handle('noteItem_set', (_, li: Data_NoteItem[]) => {
    if (checkConfigFileExist(Data_FileManager.nNoteItems)) {
      const noteItems = getData(Data_FileManager.nNoteItems) as Data_NoteItems
      noteItems.list = li
      saveData(noteItems)
      return true
    } else {
      console.error(`${consoloName}` + 'Get note items faild, file not exist')
      return false
    }
  })

  // EditNoteItem.vue 修改特定 note item
  ipcMain.handle('noteItem_alter', (_, value: Data_NoteItem) => {
    if (checkConfigFileExist(Data_FileManager.nNoteItems)) {
      console.log(
        `${consoloName}` + 'Modify note item : id: ' + value.id + ' title: ' + value.title
      )
      const noteItems = getData(Data_FileManager.nNoteItems) as Data_NoteItems
      const tempAlterItem = noteItems.list.find((item) => item.id === value.id)
      if (tempAlterItem) {
        tempAlterItem.title = value.title
        tempAlterItem.content = value.content
        tempAlterItem.check = value.check
        tempAlterItem.notificationOptions = value.notificationOptions
      }
      saveData(noteItems)
      return true
    } else {
      console.error(
        `${consoloName}` +
          'Alter note item faild: ' +
          value +
          '\nFile name note exist: ' +
          Data_FileManager.nNoteItems
      )
      return false
    }
  })

  // 渲染线程修改 settings
  ipcMain.handle('randererModifySettings', (_, obj: Data_RendererModifySettingsObject) => {
    if (checkConfigFileExist(Data_FileManager.nSetting)) {
      const data_Setting = getData(Data_FileManager.nSetting) as Data_Setting

      // 关闭时是否最小化到托盘
      if (obj.name === 'isMinimize') {
        data_Setting.isMinimize = obj.value as boolean
        isMinimize = obj.value as boolean
      }

      saveData(data_Setting)
      return true
    } else {
      return false
    }
  })

  // 渲染线程获取 settings
  ipcMain.handle('randererGetSettings', () => {
    if (checkConfigFileExist(Data_FileManager.nSetting)) {
      const settings = getData(Data_FileManager.nSetting) as Data_Setting
      const rendererSettings = {
        isMinimize: settings.isMinimize
      }
      return rendererSettings
    } else {
      console.error(`${consoloName}` + 'Get settings faild, file not exist')
      return false
    }
  })
}

// 初始化时加载配置文件
const loadDataOnInitial = (mainWindow: BrowserWindow): void => {
  // setting
  if (checkConfigFileExist(Data_FileManager.nSetting)) {
    const data_Setting = getData(Data_FileManager.nSetting) as Data_Setting

    // 设置窗口位置为上次关闭时位置和尺寸
    mainWindow.setPosition(data_Setting.windowPositionX, data_Setting.windowPositionY)
    mainWindow.setSize(data_Setting.windowBoundsWidth, data_Setting.windowBoundsHeight)

    // 加载主题颜色模式
    nativeTheme.themeSource = data_Setting.themeSource

    // 加载是否可以通过标题栏直接关闭应用程序
    isMinimize = data_Setting.isMinimize
  }
}

// 关闭应用时保存配置文件
const saveDataOnClose = (mainWindow: BrowserWindow): void => {
  // setting
  if (checkConfigFileExist(Data_FileManager.nSetting)) {
    const data_Setting = getData(Data_FileManager.nSetting) as Data_Setting

    // 关闭时记忆窗体尺寸和位置
    data_Setting.windowPositionX = mainWindow.getBounds().x
    data_Setting.windowPositionY = mainWindow.getBounds().y
    data_Setting.windowBoundsWidth = mainWindow.getBounds().width
    data_Setting.windowBoundsHeight = mainWindow.getBounds().height
    data_Setting.isMinimize = isMinimize

    saveData(data_Setting)
  }
}
