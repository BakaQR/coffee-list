import { Icon, IconifyIcon } from '@iconify/vue'
import { Modal } from 'ant-design-vue'
import { LegacyButtonType } from 'ant-design-vue/es/button/buttonTypes'
import { Component, h } from 'vue'

// 传入的数据结构 用于更改弹出框内容
interface modalModelBase {
  iconColor?: string
  size?: string
  title?: string
  content?: string
  type?: LegacyButtonType
  maskClosable?: boolean
  handleOk: () => void
  handleCancel?: () => void
}

export type modalModel = modalModelBase &
  (
    | { isIconify: true; icon?: string | IconifyIcon }
    | { isIconify?: false; icon?: Component }
  )

// 打开 Ant Design Vue 的弹出框  传入 isIconify: true 时表示传入的是 iconify 图标
//  {
//    isIconify: true,
//    icon: 'lucide:alert-circle',
//    // 其他字段
// }
export const openAntDesignModal = (model: modalModel) => {
  const iconData = model.isIconify
    ? h(Icon, {
        icon: model.icon ?? '',
        class: 'anticon',
        style: {
          color: model.iconColor,
          fontSize: model.size,
        },
      })
    : model.icon
      ? h(model.icon, { twoToneColor: model.iconColor })
      : undefined

  Modal.confirm({
    icon: iconData,
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
      if (model.handleCancel) model.handleCancel()
      Modal.destroyAll()
    },
  })
}
