import { Menu } from '@tauri-apps/api/menu';
import { getCurrentWindow } from "@tauri-apps/api/window";
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { TrayIcon } from '@tauri-apps/api/tray';

const appWindow = getCurrentWindow();
appWindow.onCloseRequested(async (e) => {
    console.log(e.event.toString());
});

const menu = await Menu.new({
  items: [
    {
      id: 'show',
      text: '显示',
    },
    {
      id: 'quit',
      text: '退出',
      action: () => {
        appWindow.close();
      }
    },
  ],
});

// 系统托盘
const defaultIcon = await defaultWindowIcon();

const trayOptions = {
  menu,
  menuOnLeftClick: false,
  icon: defaultIcon ?? undefined,
  tooltip: 'coffee-list',
};

const tray = await TrayIcon.new(trayOptions);
tray.setVisible(true);