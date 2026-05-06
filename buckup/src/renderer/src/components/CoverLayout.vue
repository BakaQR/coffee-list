<template>
  <transition name="fadeAnim">
    <div v-if="compCoverStore.isShow" class="coverLayoutDiv" @click="coverClick"></div>
  </transition>
</template>

<script setup lang="ts">
// 该组件应为全局唯一 放置于 #app 模板下
// css图层优先级 10

// 点击覆盖层时使用仓库中可自定义的方法 useClickFunction()
import { computed } from 'vue'
import { useCompCoverStore } from '@renderer/pinia/store/GlobalComponentData'
const compCoverStore = useCompCoverStore()
const coverClick = () => {
  compCoverStore.useClickFunction()
}

const props = defineProps({
  opacity: {
    type: Number,
    default: 0.3
  }
})

// 用于控制覆盖层透明度 默认0.3
const opacity = computed(() => props.opacity)
</script>

<style scoped lang="scss">
$opacity: v-bind(opacity);

.coverLayoutDiv {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  opacity: $opacity;
  z-index: 10;
  transition: all 0.25s;
}

.fadeAnim-enter-active,
.fadeAnim-leave-active {
  transition: opacity 0.25s;
}

.fadeAnim-enter-from,
.fadeAnim-leave-to {
  opacity: 0;
}
</style>
