import { ref } from 'vue'

// 导出颜色

// 主线程获取的颜色
export const color_HighLight = ref()

// 固定颜色

// 通用色
export const color_BrandPrimaryColor = '#409EFF'
export const color_BrandSecondColor = '#79bbff'
export const color_BaseFill = '#F0F2F5'
export const color_DarkFill = '#EBEDF0'
export const color_LightFill = '#F5F7FA'
export const color_ExtralightFill = '#FAFCFF'

// 亮色主题
export const color_Light_BackgroundColor = '#f4f4f4'
export const color_Light_PrimaryColor = '#303133'
export const color_Light_RegularColor = '#606266'
export const color_Light_HighlightColor = '#ffe852'
export const color_Light_HighlightReversalColor = '#ffffff'
export const color_Light_BrandHoverColor = '#69b3fd'
export const color_Light_BrandActiveColor = '#337fcc'
export const color_Light_ScrollbarThumb = '#c1c1c1ff'

// 黑暗主题 (暂时搁置 等程序完成后再逐渐补完)
export const color_Dark_BackgroundColor = '#191919'
export const color_Dark_TextPrimaryColor = '#E5EAF3'
export const color_Dark_TextRegularColor = '#CFD3DC'
export const color_Dark_TextHighlightColor = '#ffffff'
export const color_Dark_BrandHoverColor = '#3375b9'
export const color_Dark_BrandActiveColor = '#66b1ff'
export const color_Dark_ScrollbarThumb = '#000000' // 未定义

// 该方法在渲染线程 main 文件进行初始化
export const initialColor = async (): Promise<void> => {
  color_HighLight.value = await getColorFromMain('highlight')
}

// 访问主线程获取系统颜色
const getColorFromMain = async (colorName: 'highlight' | 'highlight-text'): Promise<string> => {
  return await window.electron.ipcRenderer.invoke('getSystemColor', colorName)
}
