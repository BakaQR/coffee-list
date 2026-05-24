import { Menu } from '@tauri-apps/api/menu';
import { defaultWindowIcon } from '@tauri-apps/api/app';

const menu = await Menu.new({
  items: [
    {
      id: 'show',
      text: '显示',
    },
    {
      id: 'quit',
      text: '退出',
    },
  ],
});

const defaultIcon = await defaultWindowIcon();

const options = {
  menu,
  menuOnLeftClick: false,
  icon: defaultIcon ?? undefined,
};


export default options;