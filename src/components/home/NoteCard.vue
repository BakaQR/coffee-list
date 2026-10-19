<template>
  <div class="note-card-container">
    <a-card
      :bordered="false"
      :hoverable="true"
      @click="openDetail"
      @mouseenter="showActions = true"
      @mouseleave="showActions = false"
    >
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
      <div
        v-if="props.content !== ''"
        class="note-card-content font-text-normal"
      >
        <p>{{ props.content }}</p>
      </div>
      <template #actions v-if="showActions">
        <a-tooltip
          v-if="!isCheck"
          :color="`#00b96b`"
          :open="storeSettings.options.iconTooltip ? undefined : false"
        >
          <template #title>已完成</template>
          <CheckOutlined
            key="check"
            class="check-icon"
            @click.stop="checkNoteCard"
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
            @click.stop="unCheckNoteCard"
          />
        </a-tooltip>
        <a-tooltip
          :color="`blue`"
          :open="storeSettings.options.iconTooltip ? undefined : false"
        >
          <template #title>编辑</template>
          <EditOutlined key="edit" @click.stop="editNoteCard" />
        </a-tooltip>
        <a-tooltip
          :color="`red`"
          :open="storeSettings.options.iconTooltip ? undefined : false"
        >
          <template #title>删除</template>
          <DeleteOutlined
            key="delete"
            class="delete-icon"
            @click.stop="deleteNoteCard"
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
  CloseCircleTwoTone,
} from '@ant-design/icons-vue'
import { h, PropType, ref, watch } from 'vue'

import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'
import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'
import { NoteCardModel } from '@renderer/tauri/store-api'
import { Modal } from 'ant-design-vue'
import { registerNoteCardTimerTask } from '@renderer/utils/timer'

const storeSettings = useSettingsStore()
const storeNoteCard = useNoteCardStore()

const showActions = ref(false)

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
  notification: {
    type: String as PropType<'none' | 'day' | 'once'>,
    default: 'none',
  },
  timePicker: {
    type: String,
    default: '00:00',
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
    notification: props.notification,
    timePicker: props.timePicker,
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
    notification: props.notification,
    timePicker: props.timePicker,
  }
  storeNoteCard.updateNoteCard(item)
}

const editNoteCard = () => {
  const item: NoteCardModel = {
    id: props.id,
    title: props.title,
    content: props.content,
    isCheck: props.isCheck,
    notification: props.notification,
    timePicker: props.timePicker,
  }
  emit('edit-note-card', item)
}

const deleteNoteCard = () => {
  Modal.confirm({
    icon: h(CloseCircleTwoTone, { twoToneColor: '#F56C6C' }),
    content: `确认删除：「 ${[props.title]} 」?`,
    okText: '删除',
    okType: 'danger',
    centered: true,
    async onOk() {
      storeNoteCard.deleteNoteCard(props.id)
      await registerNoteCardTimerTask()
    },
    maskClosable: true,
    cancelText: '取消',
    onCancel() {
      Modal.destroyAll()
    },
  })
}

const openDetail = () => {
  const detailContainer = h(
    'div',
    {
      style: {
        width: '100%',
        minWidth: '200px',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    [
      h(
        'div',
        {
          style: {
            fontSize: '17px',
            fontWeight: '500',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        },
        `${props.title}`
      ),
      h(
        'div',
        {
          class: 'custom-scroll-content',
          style: {
            width: '100%',
            maxHeight: '400px',
            overflowY: 'auto',
            fontSize: '15px',
            fontWeight: '400',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        },
        `${props.content}`
      ),
    ]
  )

  Modal.info({
    width: 'auto',
    icon: null,
    bodyStyle: { padding: '16px' },
    content: () => detailContainer,
    okText: '确定',
    okType: 'primary',
    centered: true,
    footer: null,
    onOk() {
      Modal.destroyAll()
    },
    maskClosable: true,
  })
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
  height: auto;
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
