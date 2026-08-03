<template>
  <a-row
    style="width: 100%; height: 40px"
    justify="space-between"
    align="middle"
  >
    <a-col :span="21">
      <div class="font-text-normal">
        <div v-if="props.descriptions !== ''">
          <span>{{ props.descriptions }}</span>
        </div>
        <slot v-else name="description">
          <span>按钮文字描述</span>
        </slot>
      </div>
    </a-col>
    <a-col :span="3">
      <div class="func-area">
        <a-button v-if="props.descriptions !== ''" @click="handleButtonClick">
          {{ props.buttonText }}
        </a-button>
        <a-button v-else @click="handleButtonClick">按钮</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
const props = defineProps({
  descriptions: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'button:click'): void
}>()

const handleButtonClick = () => {
  if (props.descriptions !== '') {
    emit('button:click')
  } else {
    console.log('button option be click')
  }
}
</script>

<style scoped>
.func-area {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
