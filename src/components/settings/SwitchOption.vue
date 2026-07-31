<template>
  <a-row
    style="width: 100%; height: 40px"
    justify="space-between"
    align="middle"
  >
    <a-col :span="21">
      <div class="font-text-normal">
        <div v-if="props.descriptions !== ''">
          <span>{{ props.descriptions }}</span>
        </div>
        <slot v-else name="description">
          <span>选项文字描述</span>
        </slot>
      </div>
    </a-col>
    <a-col :span="3">
      <div class="func-area">
        <slot name="switch">
          <a-switch :checked="props.checked" @change="handleCheckedChange" />
        </slot>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
// 使用 a-switch 的设置选项
const props = defineProps({
  descriptions: {
    type: String,
    default: '',
  },
  checked: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'update:checked', value: boolean): void
}>()

const handleCheckedChange = (value: boolean) => {
  emit('update:checked', value)
}
</script>

<style scoped lang="scss">
@use 'layout';
@use 'font' as font;

.func-area {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
