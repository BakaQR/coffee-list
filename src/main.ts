import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/router'
import { pinia, initializeStore } from '@renderer/pinia'

// 引入全局样式
import '@renderer/assets/style/root.scss'

// 数据初始化
import { initialStore } from '@renderer/tauri/store-api'
await initialStore()

// 窗口管理 (包含系统托盘)
import '@renderer/tauri/window-manager'

const app = createApp(App)

app.use(router)
app.use(pinia)
await initializeStore()

app.mount('#app')
