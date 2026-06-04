<template>
  <div class="note-card-container">
    <a-card
      class="note-card"
      :title="props.title"
      :bordered="false"
      hoverable="true"
    >
      <p class="note-card-content">{{ props.content }}</p>
      <template #actions>
        <a-tooltip v-if="!isCheck" :color="`#00b96b`">
          <template #title>已完成</template>
          <CheckOutlined
            key="check"
            class="check-icon"
            @click="checkNoteCard"
          />
        </a-tooltip>
        <a-tooltip v-if="isCheck" :color="`#00b96b`">
          <template #title>取消完成标记</template>
          <CloseOutlined
            key="unCheck"
            class="check-icon"
            @click="unCheckNoteCard"
          />
        </a-tooltip>
        <a-tooltip :color="`blue`">
          <template #title>编辑</template>
          <EditOutlined key="edit" @click="editNoteCard" />
        </a-tooltip>
        <a-tooltip :color="`red`">
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

<style scoped>
.note-card-container {
  width: 220px;
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
  line-clamp: 5;
  -webkit-line-clamp: 5; /* 限制5行 */
  -webkit-box-orient: vertical; /* 垂直排列 */
  text-overflow: ellipsis; /* 显示省略号 */
  word-break: break-word; /* 自动换行 */
  line-height: 1.5; /* 行高 */
}
</style>
