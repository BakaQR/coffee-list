import './assets/style/base.scss'
import './assets/style/el_datapicker.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initialColor } from './utils/color'
import pinia from '@renderer/pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { markComponentName } from './utils/directive'

// 初始化颜色文件
initialColor()

const app = createApp(App)

// element 中文国际化语言包
app.use(ElementPlus, { locale: zhCn })

// 导入使用pinia
app.use(pinia)

// 导入注册 element icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册自定义指令
// 指令会自动添加 v- 前缀 因此 mark-component-name 在使用时会变成 v-mark-component-name
app.directive('mark-component-name', markComponentName)

app.use(router)
app.mount('#app')
