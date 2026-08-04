import mitt from 'mitt'

// 定义所有事件及其载荷的类型
export type Events = {
  // 通知触发事件
  'notification-over': void
}

const emitter = mitt<Events>()

export default emitter
