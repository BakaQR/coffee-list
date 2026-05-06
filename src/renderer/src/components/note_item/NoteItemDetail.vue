<template>
  <el-dialog
    v-model="visible"
    :title="compNoteItemDetailStore.title"
    width="auto"
    center
    align-center
    destroy-on-close
    :show-close="true"
    :append-to-body="false"
    body-class="dialogBody"
  >
    <span class="contentText">{{ compNoteItemDetailStore.content }}</span>
  </el-dialog>
</template>

<script setup lang="ts">
// 该组件应为全局唯一 放置于 #app 模板下

import { computed } from 'vue'
import { useCompNoteItemDetailStore } from '@renderer/pinia/store/GlobalComponentData'
const compNoteItemDetailStore = useCompNoteItemDetailStore()

const visible = computed({
  get: () => compNoteItemDetailStore.isShow,
  set: () => compNoteItemDetailStore.disable()
})
</script>

<style scoped lang="scss">
.contentText {
  white-space: pre-wrap;
}
</style>
