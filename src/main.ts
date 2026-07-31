import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/router'
import { pinia, initializeStore } from '@renderer/pinia'

// 全局样式
import '@renderer/assets/style/root.scss'

// 初次运行时数据初始化
import { initialStore } from '@renderer/tauri/store-api'
await initialStore()

// 系统托盘
import { updateTrayState } from '@renderer/tauri/tray-manager'
updateTrayState()

// 标题栏按钮
import '@renderer/tauri/title-bar'

const app = createApp(App)

app.use(router)
app.use(pinia)
await initializeStore()

app.mount('#app')
