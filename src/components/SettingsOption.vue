<template>
  <a-row
    style="width: 100%; height: 40px"
    justify="space-between"
    align="middle"
  >
    <a-col :span="22">
      <slot name="description">
        <span>选项文字描述</span>
      </slot>
    </a-col>
    <a-col :span="2">
      <slot name="switch">
        <a-switch />
      </slot>
    </a-col>
  </a-row>
</template>

<script setup lang="ts"></script>

<style scoped></style>
