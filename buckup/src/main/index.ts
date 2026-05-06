import {
  app,
  shell,
  BrowserWindow,
  session,
  ipcMain,
  systemPreferences,
  nativeTheme
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { getData, saveData, checkConfigFileExist } from './utils/data_store/dataStoreAPI'
import {
  Data_FileManager,
  Data_NoteItem,
  Data_NoteItems,
  Data_Setting
} from './utils/data_store/dataStoreObject'

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
    await session.defaultSession.loadExtension(vueDevToolsPath)
  } else {
    // 生产环境
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// macOS 专用窗口关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 窗口初始化
const windowInitial = (mainWindow: BrowserWindow): void => {
  // 隐藏菜单栏
  mainWindow.setMenuBarVisibility(false)

  // 读取配置文件
  loadDataOnInitial(mainWindow)

  // 监听关闭时的事件
  mainWindow.on('close', () => {
    // 关闭应用时保存配置文件
    saveDataOnClose(mainWindow)
  })
}

// ipc 事件处理
const ipcHandler = (): void => {
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

  // // 渲染线程数据持久化
  // ipcMain.on('saveData', (_, value) => {
  //   console.log('Main save data to local...')
  //   saveData(value)
  // })

  // 渲染线程获取持久化数据
  ipcMain.handle('getDataByFileName', (_, value) => {
    if (checkConfigFileExist(value)) {
      console.log('check file success: ' + value)
      return getData(value)
    } else {
      console.error('config file not exist : ' + value)
      return null
    }
  })

  // Home.vue 添加便签 添加成功返回true 失败返回false
  // 传入的变量必须是renderer中的dataStoreInterface.d.ts中声明的 Data_NoteItem 的类型
  ipcMain.handle('addNoteItem', (_, value: Data_NoteItem) => {
    if (checkConfigFileExist(Data_FileManager.nNoteItems)) {
      console.log('Add note item to list: id: ' + value.id + ' title: ' + value.title)
      const noteItems = getData(Data_FileManager.nNoteItems) as Data_NoteItems
      noteItems.list.push(value)
      saveData(noteItems)
      return true
    } else {
      console.error(
        'Add note item faild: ' + value + '\nFile name note exist: ' + Data_FileManager.nNoteItems
      )
      return false
    }
  })
  // 获取note items
  ipcMain.handle('getNoteItems', () => {
    if (checkConfigFileExist(Data_FileManager.nNoteItems)) {
      const noteItems = getData(Data_FileManager.nNoteItems) as Data_NoteItems
      return noteItems
    } else {
      console.error('Get note items faild, file not exist')
      return false
    }
  })
  // 直接通过数组覆盖设置
  ipcMain.handle('setNoteItems', (_, ni: Data_NoteItem[]) => {
    if (checkConfigFileExist(Data_FileManager.nNoteItems)) {
      const noteItems = getData(Data_FileManager.nNoteItems) as Data_NoteItems
      noteItems.list = ni
      saveData(noteItems)
      return true
    } else {
      console.error('Get note items faild, file not exist')
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

    saveData(data_Setting)
  }
}
