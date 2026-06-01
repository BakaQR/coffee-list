<template>
  <div
    class="app-container"
    @copy.prevent
    @cut.prevent
    @paste.prevent
    @contextmenu.prevent
  >
    <a-layout class="app-layout">
      <a-layout-sider
        v-model:collapsed="collapsed"
        theme="light"
        collapsed-width="60"
        :trigger="null"
        collapsible
        class="app-layout-sider"
      >
        <div class="app-logo" />
        <a-menu
          v-model:selected-keys="selectedKeys"
          mode="inline"
          @click="handleMenuRouterTo"
        >
          <a-menu-item key="/">
            <BookOutlined />
            <span>便签</span>
          </a-menu-item>
          <a-menu-item key="/settings">
            <SettingOutlined />
            <span>设置</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <!-- router view -->
        <router-view />
        <!-- router view -->
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from './router'
import { BookOutlined, SettingOutlined } from '@ant-design/icons-vue'

const collapsed = ref<boolean>(true)
const selectedKeys = ref<string[]>(['/'])

const handleMenuRouterTo = (e: { key: string }) => {
  router.push(e.key)
}
</script>

<style scoped>
.app-container {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

.app-logo {
  height: 32px;
  width: 32px;
  margin: 16px auto;
  background-image: url('./assets/icon/icon.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.app-layout {
  height: 100vh;
}

.app-layout-sider {
  background: #fff;
}
</style>
