<template>
  <!-- 给图标大小绑定vue动态变量 -->
  <div class="body_IconTransition" :style="{ width: props.size, height: props.size }">
    <img ref="note" class="icon normal" :style="{ width: props.size, height: props.size }" />
    <img
      ref="noteHighlight"
      class="icon cover"
      :style="{ width: props.size, height: props.size }"
      :class="{ beHover: props.enable }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import defaultIcon from '@renderer/assets/svg/Icon/__DefaultIcon.svg'
import defaultIconHighlight from '@renderer/assets/svg/Icon/__DefaultIconHighlight.svg'
const note = ref<HTMLImageElement>()
const noteHighlight = ref<HTMLImageElement>()

const props = defineProps({
  iconUrl: String,
  iconHighlightUrl: String,
  size: {
    type: String,
    default: '100px'
  },
  enable: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  if (props.iconUrl === undefined) {
    if (note.value) note.value.src = defaultIcon
  } else {
    if (note.value) note.value.src = props.iconUrl
  }
  if (props.iconHighlightUrl === undefined) {
    if (noteHighlight.value) noteHighlight.value.src = defaultIconHighlight
  } else {
    if (noteHighlight.value) noteHighlight.value.src = props.iconHighlightUrl
  }
})
</script>

<style scoped lang="scss">
// 图标尺寸调整在 temple 中

.body_IconTransition {
  position: relative;
  display: inline-block;
  transition: all 0.2s;
}

.icon {
  position: absolute;
  left: 0;
  top: 0;
  transition: all 0.2s;
}

.icon.cover {
  opacity: 0;
}

.icon.cover.beHover {
  opacity: 1;
}
</style>
