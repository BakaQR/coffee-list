import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

// eslint + prettier
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },

  // eslint + prettier
  // 基础规则
  eslint.configs.recommended,
  // TypeScript 规则
  tseslint.configs.recommended,
  // Vue 3 规则（扁平配置格式）
  pluginVue.configs['flat/recommended'],
  // Prettier 配置（关闭冲突规则）
  prettierConfig,

  // 配置
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint.plugin,
      vue: pluginVue,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          tabWidth: 2,
          printWidth: 80,
          trailingComma: 'es5',
          endOfLine: 'lf',
        },
      ],
      'linebreak-style': ['error', 'unix'],
      'vue/multi-word-component-names': 'off',
    },
  },

  // 忽略文件
  {
    ignores: [
      'src-tauri/**',
      'src/vite-env.d.ts',
      'dist/**',
      'node_modules/**',
      '*.log',
      'public/**',
    ],
  },
])
