<template>
  <div class="view-container">
    <a-layout-header class="view-layout-header">
      <a-row style="width: 100%" justify="space-between" align="middle">
        <a-col :span="2" style="text-align: center">
          <span class="view-layout-header-text"> 便签 </span>
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
      title="添加便签"
      cancel-text="取消"
      ok-text="确定"
      style="width: 60%"
      destroy-on-close
      :closable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <a-input v-model:value="addTitle" placeholder="请输入便签标题" />
        <a-textarea v-model:value="addContent" placeholder="请输入便签内容" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import NoteCard from '@renderer/components/NoteCard.vue'
import { FileAddOutlined } from '@ant-design/icons-vue'

import { computed, h, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'
import { useSettingsStore } from '@renderer/pinia/stores/SettingsStore'

const storeNoteCard = useNoteCardStore()
const storeSettings = useSettingsStore()

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
  addTitle.value = ''
  addContent.value = ''
}

const handleOk = () => {
  closeModal()
}

const handleCancel = () => {
  closeModal()
}

const addTitle = ref()

const addContent = ref()
</script>
<style scoped lang="scss">
@use 'layout';

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
</style>
