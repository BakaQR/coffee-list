<template>
  <div class="view-container">
    <a-layout-header class="view-layout-header">
      <a-row style="width: 100%" justify="space-between" align="middle">
        <a-col :span="2" style="text-align: center">
          <span class="font-text-title">设置</span>
        </a-col>
        <a-col :span="2" style="text-align: center">
          <!-- <a-button>按钮</a-button> -->
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="view-layout-content">
      <a-card style="margin-bottom: 16px" :bordered="false">
        <template #title>
          <p class="font-text-label">系统设置</p>
        </template>
        <div class="setting-container">
          <SwitchOption v-model:checked="switchIconTooltip">
            <template #description>
              <span>图标文字提示，鼠标悬停在右边图标查看效果。</span>
              <a-tooltip :color="`blue`">
                <template v-if="switchIconTooltip" #title>添加便签</template>
                <a-button type="text" size="large" :icon="h(FileAddOutlined)" />
              </a-tooltip>
            </template>
          </SwitchOption>
          <SwitchOption
            v-model:checked="switchShowTray"
            :descriptions="'显示系统托盘'"
          />
          <SwitchOption
            v-model:checked="switchMinimize"
            :descriptions="'最小化到系统托盘'"
          />
          <ButtonOption> </ButtonOption>
        </div>
      </a-card>

      <a-button @click="testNotification">{{ testNotifi }}</a-button>
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { FileAddOutlined } from '@ant-design/icons-vue'
import SwitchOption from '@renderer/components/settings/SwitchOption.vue'
import ButtonOption from '@renderer/components/settings/ButtonOption.vue'

import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'
import { enqueueNotification } from '@renderer/tauri/notification-api'

const storeSettings = useSettingsStore()

const switchIconTooltip = computed({
  get: () => storeSettings.options.iconTooltip,
  set: async (v: boolean) => {
    await storeSettings.setSettingOptionsByKey('iconTooltip', v)
  },
})

const switchShowTray = computed({
  get: () => storeSettings.options.showTray,
  set: async (v: boolean) => {
    await storeSettings.setSettingOptionsByKey('showTray', v)
  },
})

const switchMinimize = computed({
  get: () => storeSettings.options.minimize,
  set: async (v: boolean) => {
    await storeSettings.setSettingOptionsByKey('minimize', v)
  },
})

const testNotifi = ref('click')

const testNotification = async () => {
  if (!(await enqueueNotification('标题', '内容'))) {
    testNotifi.value = 'failed'
  } else {
    testNotifi.value = 'success'
  }
}
</script>
<style scoped lang="scss">
@use 'layout';
@use 'font' as font;

.setting-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
