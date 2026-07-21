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
            :open="storeSettings.iconTooltip ? undefined : false"
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
        >
          <NoteCard
            v-for="item in list"
            :id="item.id"
            :key="item.id"
            :title="item.title"
            :content="item.content"
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
          <p class="font-text-title">添加便签</p>
        </div>
        <div class="modal-body">
          <a-form
            ref="formRef"
            :model="formState"
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

import { computed, h, reactive, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'
import { useSettingsStore } from '@renderer/pinia/stores/SettingsStore'

const storeNoteCard = useNoteCardStore()
const storeSettings = useSettingsStore()

const formRef = ref()

// 从 pinia 中获取 note-card 数据进行双向绑定
const list = computed({
  get: () => storeNoteCard.list,
  set: async (nv) => await storeNoteCard.saveNoteCardList(nv),
})

const open = ref(false)

const addNoteCard = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
  formRef.value.resetFields()
}

const handleOk = () => {
  console.log(formState)
  closeModal()
}

const handleCancel = () => {
  closeModal()
}

interface FormState {
  title: string
  content: string
}

const formState = reactive<FormState>({
  title: '',
  content: '',
})
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
