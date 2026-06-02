<template>
  <div class="note-card-container">
    <a-card class="note-card" :title="props.title" :bordered="false">
      <span>{{ props.content }}</span>
    </a-card>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '便签标题',
  },
  content: {
    type: String,
    default: '便签内容',
  },
})
</script>

<style scoped>
.note-card-container {
  width: 220px;
}
</style>
