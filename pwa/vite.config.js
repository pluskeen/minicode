import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      // 需要自己注册 sw，或者从 `virtual:pwa-register/vue` 导入
      injectRegister: false,
      // 是否注销 sw
      selfDestroying: false,
      registerType: 'prompt',
      manifest: {
        name: 'My Vue PWA',
        short_name: 'VuePWA',
        description: 'A Vue.js PWA with Vite',
        start_url: '/?pwa=true',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      // devOptions: {
      //   // 如果想在`vite dev`命令下调试PWA, 必须启用它
      //   enabled: true,
      //   // Vite在dev模式下会使用浏览器原生的ESModule，将type设置为`"module"`与原先的保持一致
      //   type: 'module',
      // },
      workbox: {
        // 缓存静态资源
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}'],
        // 立即激活新的Service Worker
        // skipWaiting: true,
        // 新的Service Worker激活后，立即接管所有已打开的页面
        // clientsClaim: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
