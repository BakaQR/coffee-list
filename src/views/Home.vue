<template>
  <LayoutTemplate title="便签">
    <template #headerAction>
      <a-tooltip
        :color="`blue`"
        :open="storeSettings.options.iconTooltip ? undefined : false"
      >
        <template #title>添加便签</template>
        <a-button
          type="text"
          size="large"
          :icon="h(FileAddOutlined)"
          class="flex! justify-center! items-center!"
          @click="addNoteCard"
        />
      </a-tooltip>
    </template>
    <template #bodyContent>
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
            :notification="item.notification"
            :time-picker-once="item.timePickerOnce"
            :time-picker-day="item.timePickerDay""
            @edit-note-card="handleEditNoteCard"
          />
        </VueDraggable>
      </el-scrollbar>
    </template>

    <template #outsideAction>
      <NoteCardFormModal ref="noteCardFormModalRef" />
    </template>
  </LayoutTemplate>
</template>

<script setup lang="ts">
import NoteCard from '@renderer/components/home/NoteCard.vue'
import NoteCardFormModal from '@renderer/components/home/NoteCardFormModal.vue'
import { FileAddOutlined } from '@ant-design/icons-vue'

import { h, onMounted, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useNoteCardStore } from '@renderer/pinia/stores/NoteCardStore'
import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'
import { NoteCardModel } from '@renderer/tauri/store-api'
import LayoutTemplate from '@renderer/components/layout/LayoutTemplate.vue'

const storeNoteCard = useNoteCardStore()
const storeSettings = useSettingsStore()

const noteCardFormModalRef = ref<InstanceType<typeof NoteCardFormModal>>()

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

const addNoteCard = () => {
  noteCardFormModalRef.value?.openCreate()
}

const handleEditNoteCard = (item: NoteCardModel) => {
  noteCardFormModalRef.value?.openEdit(item)
}
</script>

<style scoped lang="scss">
@use 'layout';

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
</style>
