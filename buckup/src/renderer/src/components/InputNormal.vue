<template>
  <div>
    <span class="title_InputNormal">默认标题 DefaultTitle</span>
    <el-input
      class="value_InputNormal"
      :model-value="modelValue"
      spellcheck="false"
      @update:model-value="handelInputEvent"
    />
  </div>
</template>

<script setup lang="ts">
// 默认父组件使用 v-model 时 传入的变量名都为 modelValue
// 直接定义 props 的传入变量名为 modelValue
// 给 el-input 绑定父组件传递的变量 modelValue
// el-input 的更新事件默认名称是 @update:model-value
// 显式覆写 el-input 的更新事件为 handelInputEvent
// 父组件默认更新方法是 'update:modelValue'
// 定义更新方法 'update:modelValue' 的所需参数 (e: 'update:modelValue', val: string)
// @update:model-value 的更新方法会传入输入的值 因此可以看成给 handelInputEvent 传入了一个字符串
// handelInputEvent 中直接使用默认事件 'update:modelValue' 更新父组件的值

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: string) }>()
const handelInputEvent = (val: string) => {
  emit('update:modelValue', val)
}

// -------------------- 使用普通 input 的区别 --------------------
// 普通 input 只需要绑定 :value 为传入的父组件变量 modelValue
// 通过 @input 获取用户输入时的事件来更新父组件变量
// @input 会传递一个事件类型变量 e: Event 通过该变量可以获取当前 input 中的值
// const handleInput = (e: Event) => {
//   const value = (e.target as HTMLInputElement).value;
//   emit('update:modelValue', value); // 触发更新
// };
// -------------------- 使用普通 input 的区别 --------------------

import { color_Light_PrimaryColor, color_Light_RegularColor } from '@renderer/utils/color'
</script>

<style scoped lang="scss">
// 长宽均在父组件进行约束
.title_InputNormal {
  color: v-bind(color_Light_PrimaryColor);
}

:deep(.el-input__inner) {
  color: v-bind(color_Light_RegularColor);
}
</style>
