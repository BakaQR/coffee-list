<template>
  <div class="view-container">
    <a-layout-header class="view-layout-header">
      <a-row style="width: 100%" justify="space-between" align="middle">
        <a-col :span="2" style="text-align: center">
          <span class="font-text-title"> 便签 </span>
        </a-col>
        <a-col :span="2" style="text-align: center">
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
          </a-form>
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
  open.value = true
}

const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      if (isEdit.value) {
        const noteItem: NoteCardModel = {
          id: formState.id,
          title: formState.title,
          content: formState.content,
          isCheck: formState.isCheck,
        }
        storeNoteCard.updateNoteCard(noteItem)
      } else {
        const noteItem: NoteCardModel = {
          id: nanoid(10),
          title: formState.title,
          content: formState.content,
          isCheck: formState.isCheck,
        }
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
}

const formState = reactive<FormState>({
  id: '',
  title: '',
  content: '',
  isCheck: false,
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
  margin: 16px 8px 16px 16px;
}

.note-card-scrollbar {
  // 父容器是自适应的高度，因此只能使用100vh来设置高度，100vh - 96px = 16px间距
  height: calc(100vh - 96px);
}

.note-card-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.modal-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .modal-header {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
