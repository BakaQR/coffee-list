<template>
  <a-config-provider
    :locale="localeAntDesignVue"
    :theme="{
      token: {
        colorPrimary: '#2592ff',
        fontSize: 14,
      },
    }"
  >
    <el-config-provider :locale="localeElementPlus">
      <div class="app-container">
        <a-layout class="app-layout">
          <a-layout-sider
            v-model:collapsed="collapsed"
            theme="light"
            :collapsed-width="64"
            :trigger="null"
            collapsible
            class="app-layout-sider"
          >
            <div class="app-logo" />
            <a-menu
              v-model:selected-keys="selectedKeys"
              mode="inline"
              :items="items"
              @click="handleMenuRouterTo"
            >
            </a-menu>
          </a-layout-sider>
          <a-layout>
            <!-- router view -->
            <router-view />
            <!-- router view -->
          </a-layout>
        </a-layout>
      </div>
    </el-config-provider>
  </a-config-provider>
</template>

<script setup lang="ts">
import router from './router'
import { computed, h, onMounted, reactive, ref } from 'vue'
import zhCN_AntDesignVue from 'ant-design-vue/es/locale/zh_CN'
import zhCN_ElementPlus from 'element-plus/es/locale/lang/zh-cn'

const localeAntDesignVue = zhCN_AntDesignVue
const localeElementPlus = zhCN_ElementPlus

const collapsed = ref<boolean>(true)
const selectedKeys = ref<string[]>(['/'])


const pageNoteCardTitle = computed(() =>
  storeSettings.options.iconTooltip ? '便签' : ''
)
const pageSettingsTitle = computed(() =>
  storeSettings.options.iconTooltip ? '设置' : ''
)

const items = reactive([
  {
    key: '/',
    icon: () => h(BookOutlined, { class: 'text-4xl' }),
    label: '便签',
    title: pageNoteCardTitle,
  },
  {
    key: '/settings',
    icon: () => h(SettingOutlined),
    label: '设置',
    title: pageSettingsTitle,
  },
])

// 路由跳转
const handleMenuRouterTo = ({ key }: { key: string }) => {
  router.push({ path: key })
}

import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'
import { BookOutlined, SettingOutlined } from '@ant-design/icons-vue';
const storeSettings = useSettingsStore()

onMounted(async () => {
  window.addEventListener('mouseup', (e) => {
    if (e.button === 3 || e.button === 4) e.preventDefault()
  })
})

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
