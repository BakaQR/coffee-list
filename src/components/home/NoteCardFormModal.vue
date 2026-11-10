<template>
  <a-modal
    :open="open"
    centered
    cancel-text="取消"
    ok-text="确定"
    style="width: 60%"
    destroy-on-close
    :closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="modal-container">
      <div class="modal-header">
        <p class="font-text-title">{{ isEdit ? '修改便签' : '添加便签' }}</p>
      </div>
      <div class="modal-body">
        <el-scrollbar max-height="400px" class="modal-body-scrollbar">
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            autocomplete="off"
            layout="vertical"
          >
            <a-form-item label="标题" name="title">
              <a-input
                v-model:value="formState.title"
                placeholder="请输入便签标题"
              />
            </a-form-item>
            <a-form-item label="内容" name="content">
              <a-textarea
                v-model:value="formState.content"
                placeholder="请输入便签内容"
                :auto-size="{ minRows: 3, maxRows: 8 }"
              />
            </a-form-item>
            <a-form-item label="通知类型">
              <a-select v-model:value="formState.notification">
                <a-select-option value="none">不发送</a-select-option>
                <a-select-option value="once">只发送一次</a-select-option>
                <a-select-option value="day">每日</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="formState.notification !== 'none'"
              label="选择时间"
            >
              <a-time-picker
                v-if="formState.notification === 'day'"
                v-model:value="formState.timePickerDay"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间"
                style="width: 100%"
                class="time-picker-with-left-icon"
              />
              <el-date-picker
                v-if="formState.notification === 'once'"
                v-model="formState.timePickerOnce"
                type="datetime"
                placeholder="选择日期与时间"
                format="YYYY-MM-DD HH:mm"
                date-format="YYYY-MM-DD"
                time-format="HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                placement="top"
                style="width: 100%"
              />
            </a-form-item>
          </a-form>
        </el-scrollbar>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'
import type { NoteCardModel } from '@renderer/tauri/store-api'
import { registerNoteCardTimerTask } from '@renderer/utils/timer'

const emit = defineEmits<{
  (e: 'saved', item: NoteCardModel): void
}>()

const storeNoteCard = useNoteCardStore()

const formRef = ref()
const open = ref(false)
const isEdit = ref(false)

// 表单初始值：新增与编辑都以此为基准，避免残留上一次的数据
const createDefaultForm = (): NoteCardModel => ({
  id: '',
  title: '',
  content: '',
  isCheck: false,
  notification: 'none',
  timePickerOnce: '',       // YYYY-MM-DD HH:mm   2077-07-07 00:00
  timePickerDay: '',        // HH:mm              00:00
})

const resetForm = () => {
  formState.value = createDefaultForm()
}

const formState = ref<NoteCardModel>(createDefaultForm())

const rules: Record<string, Rule[]> = {
  title: [
    {
      required: true,
      message: '请输入便签标题',
      trigger: 'change',
    },
  ],
  content: [
    {
      message: '请输入便签内容',
      trigger: 'change',
    },
  ],
}

// 新增模式 清空表单 时间默认取当前时刻
const openCreate = async () => {
  isEdit.value = false
  resetForm()

  // 使用表单默认值 覆盖当前 formState 获取当前时间覆盖 timePicker
  formState.value = {
    ...createDefaultForm(),
    timePickerOnce: dayjs().format('YYYY-MM-DD HH:mm'),
    timePickerDay: dayjs().format('HH:mm'),
  }

  open.value = true
  await nextTick()
  formRef.value?.clearValidate()
}

// 编辑：回填传入的便签数据
const openEdit = async (item: NoteCardModel) => {
  isEdit.value = true
  resetForm()

  formState.value = { ...item }

  // 不发送通知时 对齐新增模式 时间默认取当前时刻
  if(formState.value.notification === 'none'){
    formState.value.timePickerOnce = dayjs().format('YYYY-MM-DD HH:mm')
    formState.value.timePickerDay = dayjs().format('HH:mm')
  }

  open.value = true
  await nextTick()
  formRef.value?.clearValidate()
}

const handleOk = async () => {
  try {
    await formRef.value?.validate()
  } catch (error) {
    console.warn('校验失败: ', error)
    return
  }

  // 不发送通知时重置两个日期的值
  if(formState.value.notification === 'none') {
    formState.value.timePickerOnce = ''
    formState.value.timePickerDay = ''
  }

  const noteItem: NoteCardModel = { ...formState.value }

  // 编辑模式下直接传递原有的id 新建模式下直接使用新的随机id
  if (isEdit.value) {
    await storeNoteCard.updateNoteCard(noteItem)
  } else {
    noteItem.id = nanoid(10)
    await storeNoteCard.addNoteCard(noteItem)
  }

  console.log(noteItem)

  // 注册通知事件
  await registerNoteCardTimerTask()

  await storeNoteCard.updateNoteCardList()
  emit('saved', noteItem)
  closeModal()
}

const handleCancel = () => {
  closeModal()
}

const closeModal = () => {
  open.value = false
  isEdit.value = false
}

// 供父组件通过 ref 调用的方法
defineExpose({
  openCreate,
  openEdit,
})
</script>

<style scoped lang="scss">
@use 'font';
@use 'color';

.modal-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 24px;

  .modal-header {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-body {
    max-height: 400px;
  }
}

.modal-body-scrollbar {
  padding-right: 24px;
}

:deep(.time-picker-with-left-icon) {
  padding-left: 0px;
}

:deep(.time-picker-with-left-icon .ant-picker-suffix) {
  position: absolute;
  left: 8px;
}

:deep(.time-picker-with-left-icon .ant-picker-input) {
  padding-left: 32px;
}
</style>
