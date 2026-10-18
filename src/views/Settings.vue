<template>
  <LayoutTemplate title="设置">
    <template #bodyContent>
      <div class="p-4">
        <a-card :bordered="false">
          <template #title>
            <p class="font-text-label">系统设置</p>
          </template>

          <div class="flex flex-col gap-4">
            <SwitchOption v-model:checked="switchIconTooltip">
              <template #description>
                <div class="flex justify-start items-center">
                  <span>图标文字提示，鼠标悬停在右边图标查看效果。</span>
                  <a-tooltip :color="`blue`">
                    <template v-if="switchIconTooltip" #title
                      >添加便签</template
                    >
                    <a-button
                      type="text"
                      size="large"
                      :icon="h(FileAddOutlined)"
                      class="flex! justify-center! items-center!"
                    />
                  </a-tooltip>
                </div>
              </template>
            </SwitchOption>
            <SwitchOption
              v-model:checked="switchShowTray"
              :descriptions="'显示系统托盘'"
            />
            <SwitchOption
              v-model:checked="switchMinimize"
              :descriptions="'关闭时最小化到系统托盘'"
            />
            <SwitchOption
              v-model:checked="switchAutoStart"
              :descriptions="'开机自启动'"
            />
            <SwitchOption
              v-model:checked="switchNotificationSound"
              :descriptions="'通知音效'"
            />
            <ButtonOption
              :button-text="'发送通知'"
              :descriptions="'测试系统通知，如无显示，请检查「设置-系统-通知」是否允许程序发送通知'"
              @button:click="testNotification"
            />
          </div>
        </a-card>
      </div>
    </template>
  </LayoutTemplate>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { FileAddOutlined } from '@ant-design/icons-vue'
import SwitchOption from '@renderer/components/settings/SwitchOption.vue'
import ButtonOption from '@renderer/components/settings/ButtonOption.vue'

import { useSettingsStore } from '@renderer/pinia/stores/SettingStore'
import { enqueuePersistedNotification } from '@renderer/tauri/notification-api'
import LayoutTemplate from '@renderer/components/layout/LayoutTemplate.vue'

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

const switchAutoStart = computed({
  get: () => storeSettings.options.autoStart,
  set: async (v: boolean) => {
    await storeSettings.setSettingOptionsByKey('autoStart', v)
  },
})

const switchNotificationSound = computed({
  get: () => storeSettings.options.notificationSound,
  set: async (v: boolean) => {
    await storeSettings.setSettingOptionsByKey('notificationSound', v)
  },
})

const testNotification = async () => {
  await enqueuePersistedNotification('测试通知是否正常发送', '现已发送成功！')
}
</script>
<style scoped lang="scss">
@use 'layout';
@use 'font' as font;
</style>
