import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'

// element-plus
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// ant-design-vue
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// tailwindcss
import tailwindcss from '@tailwindcss/vite';

// vue-devtools
import VueDevtools from 'vite-plugin-vue-devtools'

// https://icon-sets.iconify.design/
import iconifyOffline from 'vite-plugin-iconify-offline';

const host = process.env.TAURI_DEV_HOST

export default defineConfig(async () => ({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    VueDevtools({
      componentInspector: true,
    }),
    Components({
      // auto import ant-design-vue components
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
        ElementPlusResolver(),
      ],
    }),
    iconifyOffline({
      // 显式指定使用官方离线入口，确保产物中不含联网代码
      package: '@iconify/vue/offline',
      exclude: ['00', 'button'],
    }),
  ],

  resolve: {
    alias: {
      '@renderer': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          // fileURLToPath(new URL('./src', import.meta.url)),
          // fileURLToPath(new URL('./src/assets', import.meta.url)),
          fileURLToPath(new URL('./src/assets/style', import.meta.url)),
        ],
      },
    },
  },

  build: {
    target: 'esnext',
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 3010,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 3011,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}))
