<template>
  <a-config-provider
    :locale="locale"
    :theme="{
      token: {
        borderRadius: themeState.borderRadius,
        colorPrimary: themeState.colorPrimary,
        fontSize: themeState.fontSize,
      },
    }"
  >
    <div class="app-container">
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
            <a-menu-item key="/" :title="pageNoteCardTitle">
              <BookOutlined />
              <span>便签</span>
            </a-menu-item>
            <a-menu-item key="/settings" :title="pageSettingsTitle">
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
  </a-config-provider>
</template>

<script setup lang="ts">
import router from './router'
import { computed, onMounted, ref } from 'vue'
import { BookOutlined, SettingOutlined } from '@ant-design/icons-vue'

const themeState = ref({
  colorPrimary: '#2592ff',
  fontSize: 15,
  borderRadius: 6,
})

import zhCN from 'ant-design-vue/es/locale/zh_CN'
const locale = zhCN

const collapsed = ref<boolean>(true)
const selectedKeys = ref<string[]>(['/'])

// 路由跳转
const handleMenuRouterTo = (e: { key: string }) => {
  router.push(e.key)
}

import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'
const storeSettings = useSettingsStore()

onMounted(async () => {
  window.addEventListener('mouseup', (e) => {
    if (e.button === 3 || e.button === 4) e.preventDefault()
  })
})

const pageNoteCardTitle = computed(() =>
  storeSettings.options.iconTooltip ? '便签' : ''
)
const pageSettingsTitle = computed(() =>
  storeSettings.options.iconTooltip ? '设置' : ''
)
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
  background-image: url('./assets/icon/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.app-layout {
  height: 100vh;
}
</style>
