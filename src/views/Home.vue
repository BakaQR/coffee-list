<template>
  <div class="view-container">
    <a-layout-header class="view-layout-header">
      <a-row style="width: 100%" justify="space-between" align="middle">
        <a-col :span="2" style="text-align: left">
          <span class="font-text-title"> 便签 </span>
        </a-col>
        <a-col :span="2" style="text-align: right">
          <a-tooltip
            :color="`blue`"
            :open="storeSettings.options.iconTooltip ? undefined : false"
          >
            <template #title>添加便签</template>
            <a-button
              type="text"
              size="large"
              :icon="h(FileAddOutlined)"
              @click="addNoteCard"
            />
          </a-tooltip>
        </a-col>
      </a-row>
    </a-layout-header>

    <a-layout-content class="view-layout-content">
      <el-scrollbar class="note-card-scrollbar">
        <VueDraggable
          v-model="list"
          class="note-card-list-container"
          :animation="150"
          :force-fallback="true"
          ghost-class="ghost-item"
          :fallback-tolerance="50"
          @end="onDragEnd"
        >
          <NoteCard
            v-for="item in list"
            :id="item.id"
            :key="item.id"
            :title="item.title"
            :content="item.content"
            :is-check="item.isCheck"
            @edit-note-card="handleEditNoteCard"
          />
        </VueDraggable>
      </el-scrollbar>
    </a-layout-content>

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
          <p v-if="!isEdit" class="font-text-title">添加便签</p>
          <p v-else class="font-text-title">修改便签</p>
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
                  v-model:value="formState.pickTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间"
                />
              </a-form-item>
            </a-form>
          </el-scrollbar>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import NoteCard from '@renderer/components/NoteCard.vue'
import { FileAddOutlined } from '@ant-design/icons-vue'

import { h, onMounted, reactive, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'
import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'
import { NoteCardModel } from '@renderer/tauri/store-api'
import { nanoid } from 'nanoid'
import { Rule } from 'ant-design-vue/es/form'
import dayjs from 'dayjs'

const storeNoteCard = useNoteCardStore()
const storeSettings = useSettingsStore()

const formRef = ref()

const list = ref<NoteCardModel[]>([])

onMounted(() => {
  list.value = storeNoteCard.list
})

const onDragEnd = () => {
  storeNoteCard.saveNoteCardList(list.value)
}

watch(
  () => storeNoteCard.list,
  (nv) => {
    list.value = nv
  },
  { deep: true }
)

const open = ref(false)

const addNoteCard = () => {
  formState.id = ''
  formState.title = ''
  formState.content = ''
  formState.isCheck = false
  formState.notification = 'none'
  formState.pickTime = dayjs().format('HH:mm')
  open.value = true
}

const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      const noteItem: NoteCardModel = {
        id: formState.id,
        title: formState.title,
        content: formState.content,
        isCheck: formState.isCheck,
        notification: formState.notification,
        timePicker: formState.pickTime,
      }
      if (noteItem.timePicker === null) noteItem.timePicker = '00:00'
      if (isEdit.value) {
        storeNoteCard.updateNoteCard(noteItem)
      } else {
        noteItem.id = nanoid(10)
        storeNoteCard.addNoteCard(noteItem)
      }
      closeModal()
    })
    .catch((error: unknown) => {
      console.log('校验失败: ', error)
    })
}

const handleCancel = () => {
  closeModal()
}

const isEdit = ref(false)

const handleEditNoteCard = (item: NoteCardModel) => {
  isEdit.value = true
  formState.id = item.id
  formState.title = item.title
  formState.content = item.content
  formState.isCheck = item.isCheck
  formState.notification = item.notification
  formState.pickTime = item.timePicker
  open.value = true
}

const closeModal = () => {
  open.value = false
  isEdit.value = false
  formRef.value.resetFields()
}

interface FormState {
  // id 只在编辑模式下使用 添加模式下直接使用 nanoid
  // isCheck 只作为传递使用 具体在组件内部修改该值
  id: string
  title: string
  content: string
  isCheck: boolean
  notification: 'none' | 'once' | 'day'
  pickTime: string
}

const formState = reactive<FormState>({
  id: '',
  title: '',
  content: '',
  isCheck: false,
  notification: 'none',
  pickTime: '00:00',
})

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
      required: true,
      message: '请输入便签内容',
      trigger: 'change',
    },
  ],
}
</script>

<style scoped lang="scss">
@use 'layout';
@use 'font';
@use 'color';

.view-layout-content {
  padding: 0 4px 0 0;
}

.note-card-scrollbar {
  height: calc(100vh - 64px);
}

.note-card-list-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  gap: 16px;
  padding: 16px;
}

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
</style>
