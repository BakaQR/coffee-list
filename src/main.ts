import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/router'

// 引入全局样式
import '@renderer/assets/style/root.scss'

// 数据初始化
import { initialStore } from '@renderer/tauri/store-api'
initialStore()

// 窗口管理 (包含系统托盘)
import '@renderer/tauri/window-manager'

const app = createApp(App)

app.use(router)
app.mount('#app')
