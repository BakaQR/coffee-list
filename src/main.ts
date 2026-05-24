import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 窗口管理 (包含系统托盘)
import "./tauri/window-manager";

const app = createApp(App);
app.use(router);
app.mount("#app");
