import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 系统托盘
import { TrayIcon } from '@tauri-apps/api/tray';
import trayOptions from "./tauri/tray-options";
const tray = await TrayIcon.new(trayOptions);

const app = createApp(App);
app.use(router);
app.mount("#app");
