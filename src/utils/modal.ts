import { Icon } from "@iconify/vue"
import { Modal } from "ant-design-vue"
import { LegacyButtonType } from "ant-design-vue/es/button/buttonTypes"
import { h } from "vue"

// 传入的数据结构 用于更改弹出框内容
export interface modalModel {
  icon?: any,
  iconColor?: string,
  size?: string, // isIconify = true 时才使用该值
  title?: string,
  content?: string,
  type?: LegacyButtonType,
  maskClosable?: boolean,
  handleOk: Function,
  handleCancel?: Function
}

// 打开 Ant Design Vue 的弹出框  isIconify=true 时表示传入的是 iconify 图标
export const openAntDesignModal = (model: modalModel, isIconify = false) => {
  let icon = null
  if(isIconify) {
    // 传入 iconify 图标 'lucide:alert-circle'
    icon = h(Icon, {
      icon: model.icon,
      class: 'anticon', // 让 Ant Design 的样式生效
      style: {
        color: model.iconColor,
        fontSize: model.size, // 图标大小 默认 24px
      }
    })
  }else {
    // 传入 Ant Design 图标 CloseCircleTwoTone 记得图标导出时需要使用 {} 包裹
    icon = h(model.icon, { twoToneColor: model.iconColor })
  }
  Modal.confirm({
    icon: icon,
    title: model.title ?? '默认标题',
    content: model.content ?? '默认内容',
    okText: '确定',
    okType: model.type,
    centered: true,
    async onOk() {
      model.handleOk()
    },
    maskClosable: model.maskClosable,
    cancelText: '取消',
    onCancel() {
      if(model.handleCancel) model.handleCancel()
      Modal.destroyAll()
    },
  })
}
