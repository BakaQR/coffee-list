import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 数据读取
import { initialStore } from "./tauri/store-api";
initialStore();

// 窗口管理 (包含系统托盘)
import "./tauri/window-manager";

const app = createApp(App);
app.use(router);
app.mount("#app");
