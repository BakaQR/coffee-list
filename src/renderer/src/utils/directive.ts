// 指令需要在 main.ts 中注册
// import { markComponentName } from './utils/directive'
// app.directive('mark-component-name', markComponentName)

import { Directive } from 'vue'

interface MarkDirectiveValueType {
  componentName: string
}

export const markComponentName: Directive<HTMLElement, MarkDirectiveValueType> = {
  mounted(element, binding) {
    element.setAttribute('data-component-name', binding.value.componentName)
  },
  updated(element, binding) {
    element.setAttribute('data-component-name', binding.value.componentName)
  }
}
