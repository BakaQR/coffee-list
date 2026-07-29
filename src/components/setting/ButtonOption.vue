<template>
  <a-row
    style="width: 100%; height: 40px"
    justify="space-between"
    align="middle"
  >
    <a-col :span="21">
      <slot name="description">
        <span>按钮描述</span>
      </slot>
    </a-col>
    <a-col :span="3">
      <div class="func-area">
        <slot name="button">
          <a-button>按钮</a-button>
        </slot>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts"></script>

<style scoped>
.func-area {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
