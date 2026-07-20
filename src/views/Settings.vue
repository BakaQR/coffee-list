<template>
  <div
    class="view-container"
    @copy.prevent
    @cut.prevent
    @paste.prevent
    @contextmenu.prevent
  >
    <a-layout-header class="view-layout-header">
      <a-row style="width: 100%" justify="space-between" align="middle">
        <a-col :span="2" style="text-align: center">
          <span class="view-layout-header-text">设置</span>
        </a-col>
        <a-col :span="2" style="text-align: center">
          <!-- <a-button>按钮</a-button> -->
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="view-layout-content">
      <a-card style="margin-bottom: 16px" :bordered="false">
        <template #title>
          <p class="setting-title">系统设置</p>
        </template>
        <SwitchOption>
          <template #description>
            图标文字提示，鼠标悬停在右边图标查看效果。
            <a-tooltip :color="`blue`">
              <template v-if="switchIconTooltip" #title>添加便签</template>
              <a-button type="text" size="large" :icon="h(FileAddOutlined)" />
            </a-tooltip>
          </template>
          <template #switch>
            <a-switch v-model:checked="switchIconTooltip" />
          </template>
        </SwitchOption>
      </a-card>
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { FileAddOutlined } from '@ant-design/icons-vue'
import SwitchOption from '@renderer/components/SwitchOption.vue'

import { useSettingsStore } from '@renderer/pinia/stores/SettingsStore'
import { SettingsOptions } from '@renderer/tauri/store-api'
const storeSettings = useSettingsStore()

const switchIconTooltip = computed({
  get: () => storeSettings.iconTooltip,
  set: async (v: string | number | boolean) => {
    await storeSettings.setSettingsOptionsByName(SettingsOptions.IconTooltip, v)
    await storeSettings.updateIconTooltip()
  },
})
</script>
<style scoped lang="scss">
@use 'layout';
@use 'color' as color;
@use 'font' as font;

.setting-title {
  color: color.$light-primary;
}
</style>
