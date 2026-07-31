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
    saveSettingOptionsData()
  }

  return {
    options,
    setSettingOptionsByKey,
    updateSettingData,
  }
})
