<template>
  <main class="container">
    <h1>About</h1>
    <p>测试 tauri store</p>
    <p>---> {{ text }} <---</p>
    <button @click="updateText">update</button>
    <input v-model="inputText" placeholder="测试输入保存值" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { load, Store } from '@tauri-apps/plugin-store';

const text = ref();
const inputText = ref();

let testStore: Store | null = null

const updateText = async () => {
  if (!testStore) return;
  
  await testStore.set('id', inputText.value);
  text.value = await testStore.get('id');
};

onMounted(async () => {
  testStore = await load('test.json');
  text.value = await testStore.get('id');
});
</script>

<style scoped>
.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>
