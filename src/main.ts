import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/router'
import { pinia, initializeStore } from '@renderer/pinia'

// 全局样式
import '@renderer/assets/style/tailwind.css'
import '@renderer/assets/style/root.scss'

// 标题栏按钮
import '@renderer/tauri/title-bar'

// 初次运行数据初始化
import { initialStore } from '@renderer/tauri/store-api'
await initialStore()

// 系统托盘
import { updateTrayState } from '@renderer/tauri/tray-manager'
await updateTrayState()

// 静默启动
import { silentStart } from '@renderer/tauri/autostart'
await silentStart()

// 注册便签系统通知事件
import { registerNoteCardTimerTask } from '@renderer/utils/timer'
await registerNoteCardTimerTask()

const app = createApp(App)

app.use(router)
app.use(pinia)

// pinia 更新数据
await initializeStore()

app.mount('#app')
