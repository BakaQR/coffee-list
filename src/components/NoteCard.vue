<template>
  <div class="note-card-container">
    <a-card class="note-card" :bordered="false" :hoverable="true">
      <template #title>
        <div class="note-card-title font-text-label">
          <CheckCircleTwoTone
            two-tone-color="#00b96b"
            class="is-check-icon"
            :class="{
              'pulse-in': pulseIn,
              'pulse-out': pulseOut,
              'is-check-icon-active': isCheck,
            }"
          />
          <p>{{ props.title }}</p>
        </div>
      </template>
      <div class="note-card-content font-text-normal">
        <p>{{ props.content }}</p>
      </div>
      <template #actions>
        <a-tooltip
          v-if="!isCheck"
          :color="`#00b96b`"
          :open="storeSettings.options.iconTooltip ? undefined : false"
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
          :open="storeSettings.options.iconTooltip ? undefined : false"
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
          :open="storeSettings.options.iconTooltip ? undefined : false"
        >
          <template #title>编辑</template>
          <EditOutlined key="edit" @click="editNoteCard" />
        </a-tooltip>
        <a-tooltip
          :color="`red`"
          :open="storeSettings.options.iconTooltip ? undefined : false"
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
  CheckCircleTwoTone,
} from '@ant-design/icons-vue'
import { ref, watch } from 'vue'

import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'
import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'
import { NoteCardModel } from '@renderer/tauri/store-api'

const storeSettings = useSettingsStore()
const storeNoteCard = useNoteCardStore()

const props = defineProps({
  id: {
    type: String,
    default: '0',
  },
  title: {
    type: String,
    default: '便签标题',
  },
  content: {
    type: String,
    default: '便签内容',
  },
  isCheck: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit-note-card'])

const isCheck = ref(props.isCheck)

const checkNoteCard = () => {
  isCheck.value = true
  const item: NoteCardModel = {
    id: props.id,
    title: props.title,
    content: props.content,
    isCheck: isCheck.value,
  }
  storeNoteCard.updateNoteCard(item)
}

const unCheckNoteCard = () => {
  isCheck.value = false
  const item: NoteCardModel = {
    id: props.id,
    title: props.title,
    content: props.content,
    isCheck: isCheck.value,
  }
  storeNoteCard.updateNoteCard(item)
}

const editNoteCard = () => {
  const item: NoteCardModel = {
    id: props.id,
    title: props.title,
    content: props.content,
    isCheck: props.isCheck,
  }
  emit('edit-note-card', item)
}

const deleteNoteCard = () => {
  storeNoteCard.deleteNoteCard(props.id)
}

// 用于控制图标动画效果
const pulseIn = ref(false)
const pulseOut = ref(false)

watch(isCheck, (nv) => {
  if (nv) {
    pulseIn.value = true
    setTimeout(() => {
      pulseIn.value = false
    }, 300)
  } else {
    pulseOut.value = true
    setTimeout(() => {
      pulseOut.value = false
    }, 300)
  }
})
</script>

<style scoped lang="scss">
@use 'color' as color;
@use 'font' as font;

.note-card-container {
  width: 240px;
}

.check-icon:hover :deep(svg) {
  color: #00b96b;
}

.delete-icon:hover :deep(svg) {
  color: #ff7875;
}

.note-card-title {
  display: flex;
  // gap: 8px;
  justify-content: center;
  align-items: center;

  p {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.note-card-content {
  margin: 0;
  padding: 0;
  overflow: hidden;

  white-space: pre-wrap;
  word-break: break-word;
  display: -webkit-box;
  line-clamp: 5;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.is-check-icon {
  width: 0px;
  opacity: 0;
  margin-right: 0px;
  // transition: all 0.3s;
}

.is-check-icon-active {
  width: 20px;
  opacity: 1;
  margin-right: 8px;
}

@keyframes pulse-in {
  0% {
    width: 0;
    opacity: 0;
    margin-right: 0px;
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
    margin-left: 4px;
  }
  100% {
    width: 20px;
    opacity: 1;
    margin-right: 8px;
    transform: scale(1);
  }
}

@keyframes pulse-out {
  0% {
    width: 20px;
    opacity: 1;
    margin-right: 8px;
    transform: scale(1);
  }
  100% {
    width: 0;
    opacity: 0;
    margin-right: 0px;
    transform: scale(0);
  }
}

.pulse-in {
  animation: pulse-in 0.3s ease-out forwards;
}

.pulse-out {
  animation: pulse-out 0.3s ease-out forwards;
}
</style>
