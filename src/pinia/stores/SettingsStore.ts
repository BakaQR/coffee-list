import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  SettingsOptions,
  setSettingsOptions,
  getSettingsOptions,
} from '@renderer/tauri/store-api'

export const useSettingsStore = defineStore('settings-store', () => {
  const iconTooltip = ref(false)

  // 更新所有数据
  const updateSettingsData = async () => {
    await updateIconTooltip()
  }

  const updateIconTooltip = async () => {
    iconTooltip.value = (await getSettingsOptions(
      SettingsOptions.IconTooltip
    )) as boolean
  }

  const getSettingsOptionsByName = async (optionName: SettingsOptions) => {
    await getSettingsOptions(optionName)
  }

  const setSettingsOptionsByName = async (
    optionName: SettingsOptions,
    value: string | number | boolean
  ) => {
    await setSettingsOptions(optionName, value)
  }

  return {
    iconTooltip,
    getSettingsOptionsByName,
    setSettingsOptionsByName,
    updateSettingsData,
    updateIconTooltip,
  }
})
