<template>
  <div class="note-card-container">
    <a-card class="note-card" :bordered="false" :hoverable="true">
      <template #title>
        <p class="note-card-title">{{ props.title }}</p>
      </template>
      <p class="note-card-content">{{ props.content }}</p>
      <template #actions>
        <a-tooltip
          v-if="!isCheck"
          :color="`#00b96b`"
          :open="storeSettings.iconTooltip ? undefined : false"
        >
          <template #title>已完成</template>
          <CheckOutlined
            key="check"
            class="check-icon"
            @click="checkNoteCard"
          />
        </a-tooltip>
        <a-tooltip
          v-if="isCheck"
          :color="`#00b96b`"
          :open="storeSettings.iconTooltip ? undefined : false"
        >
          <template #title>取消完成标记</template>
          <CloseOutlined
            key="unCheck"
            class="check-icon"
            @click="unCheckNoteCard"
          />
        </a-tooltip>
        <a-tooltip
          :color="`blue`"
          :open="storeSettings.iconTooltip ? undefined : false"
        >
          <template #title>编辑</template>
          <EditOutlined key="edit" @click="editNoteCard" />
        </a-tooltip>
        <a-tooltip
          :color="`red`"
          :open="storeSettings.iconTooltip ? undefined : false"
        >
          <template #title>删除</template>
          <DeleteOutlined
            key="delete"
            class="delete-icon"
            @click="deleteNoteCard"
          />
        </a-tooltip>
      </template>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { ref } from 'vue'

import { useSettingsStore } from '@renderer/pinia/stores/SettingsStore'

const storeSettings = useSettingsStore()

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: '便签标题',
  },
  content: {
    type: String,
    default: '便签内容',
  },
})

const isCheck = ref(false)

const checkNoteCard = () => {
  console.log('check note card')
  isCheck.value = true
}

const unCheckNoteCard = () => {
  console.log('un check note card')
  isCheck.value = false
}

const editNoteCard = () => {
  console.log('edit note card')
}

const deleteNoteCard = () => {
  console.log('delete note card')
}
</script>

<style scoped lang="scss">
@use 'color' as color;
@use 'font' as font;

.note-card-container {
  width: 220px;
}

.note-card-title {
  color: color.$light-text-primary;
  font-weight: font.font-weight('medium');
}

.check-icon:hover :deep(svg) {
  color: #00b96b;
}

.delete-icon:hover :deep(svg) {
  color: #ff7875;
}

.note-card-content {
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: -webkit-box;
  color: color.$light-text-primary;

  line-clamp: 5;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.5;
}
</style>
