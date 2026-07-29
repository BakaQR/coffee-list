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
          <SwitchOption>
            <template #description>
              <div class="font-text-normal">
                <span>图标文字提示，鼠标悬停在右边图标查看效果。</span>
                <a-tooltip :color="`blue`">
                  <template v-if="switchIconTooltip" #title>添加便签</template>
                  <a-button
                    type="text"
                    size="large"
                    :icon="h(FileAddOutlined)"
                  />
                </a-tooltip>
              </div>
            </template>
            <template #switch>
              <a-switch v-model:checked="switchIconTooltip" />
            </template>
          </SwitchOption>
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
import SwitchOption from '@renderer/components/setting/SwitchOption.vue'
import ButtonOption from '@renderer/components/setting/ButtonOption.vue'

import { useSettingsStore } from '@renderer/pinia/stores/SettingsStore'
import { SettingsOptions } from '@renderer/tauri/store-api'
import { enqueueNotification } from '@renderer/tauri/notification-api'
const storeSettings = useSettingsStore()

const switchIconTooltip = computed({
  get: () => storeSettings.iconTooltip,
  set: async (v: string | number | boolean) => {
    await storeSettings.setSettingsOptionsByName(SettingsOptions.IconTooltip, v)
    await storeSettings.updateIconTooltip()
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
