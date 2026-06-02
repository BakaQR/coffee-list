<template>
  <div
    class="view-container"
    @copy.prevent
    @cut.prevent
    @paste.prevent
    @contextmenu.prevent
  >
    <a-layout-header class="view-layout-header">
      <span class="view-layout-header-text"> 便签 </span>
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
            :key="item.id"
            :title="`测试标题${item.id}`"
            :content="`测试内容${item.content}`"
          />
        </VueDraggable>
      </el-scrollbar>
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
import NoteCard from '@renderer/components/NoteCard.vue'

import { computed, onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import {
  I_NoteCard,
  setNoteCardList,
  getNoteCardList,
} from '@renderer/tauri/store-api'

// list需要借助listTemp来实现双向绑定，因为get中无法使用await，无法正确更新列表
const list = computed({
  get: () => listTemp.value,
  set: async (value: I_NoteCard[]) => {
    await setNoteCardList(value)
    await updateList()
  },
})
const listTemp = ref<I_NoteCard[]>([])
const updateList = async () => {
  listTemp.value = await getNoteCardList()
}

onMounted(async () => {
  await updateList()
})
</script>
<style scoped lang="scss">
@use 'style/_layout';

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
