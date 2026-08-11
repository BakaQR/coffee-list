import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getSettingOptions,
  setSettingOptions,
  SettingOptionsModel,
} from '@renderer/tauri/store-api'

export type SettingOptionKeys = keyof SettingOptionsModel

export const useSettingsStore = defineStore('settings-store', () => {
  const options = ref<SettingOptionsModel>({
    iconTooltip: false,
    showTray: false,
    minimize: false,
    autoStart: false,
    notificationSound: false,
  })

  // 从 store 中更新数据到 pinia
  const updateSettingData = async () => {
    options.value = (await getSettingOptions()) as SettingOptionsModel
  }

  const saveSettingOptionsData = async () => {
    await setSettingOptions(options.value)
    await updateSettingData()
  }

  const setSettingOptionsByKey = async (
    key: SettingOptionKeys,
    value: SettingOptionsModel[SettingOptionKeys]
  ) => {
    options.value[key] = value
    fixOption(key, value)
    saveSettingOptionsData()
  }

  // 处理互相冲突或有联动的设置选项
  const fixOption = (
    key: SettingOptionKeys,
    value: SettingOptionsModel[SettingOptionKeys]
  ) => {
    // 设置 minimize 为 true 时同时设置 showTray 为 true
    if (key === 'minimize') {
      if (value) {
        if (!options.value['showTray']) {
          options.value['showTray'] = true
        }
      }
    }
    // 设置 showTray 为 false 时同时设置 minimize 为 false
    if (key === 'showTray') {
      if (!value) {
        if (options.value['minimize']) {
          options.value['minimize'] = false
        }
      }
    }
  }

  return {
    options,
    setSettingOptionsByKey,
    updateSettingData,
  }
})
