// @ts-ignore - 忽略类型错误，确保构建成功
import { defineNuxtConfig } from 'nuxt/config'
// import fs from 'fs' // No longer needed
// import path from 'path' // No longer needed

// No need to read package.json here
// Nuxt will automatically load NUXT_PUBLIC_APP_VERSION from the .env file

// Directly read the environment variable set during build
const appVersion = process.env.BUILD_TIME_APP_VERSION || '0.0.0' // Default if not set
console.log('[Nuxt Config] Build time app version from ENV:', appVersion);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  dir: {
    pages: 'pages',
  },
  ssr: false, // Github pages require
  app: {
    // 不使用子路径，应为我们用自定义域名
    baseURL: '/',
    // 使用标准资源目录
    buildAssetsDir: '_nuxt',
    head: {
      title: '一键大厨 - 轻松学做美食',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: '一键大厨是一个让你轻松学做美食的应用，通过隔空手势操作，边学边做，轻松成为大厨。' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/images/logo.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/logo.png' }
      ]
    }
  },
  
  css: [
    '~/assets/css/main.css',
    '~/assets/css/element-plus-override.css'
  ],
  
  modules: [
    '@nuxt/ui',
    '@element-plus/nuxt'
  ],

  // Element Plus配置
  elementPlus: {
    importStyle: 'scss',
  },

  // VITE配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 不使用additionalData避免循环引用
          // 直接在scss文件中导入所需模块
        }
      }
    }
  },

  // Add explicit empty config for Nuxt Content
  // content: {
  //   // https://content.nuxt.com/docs/getting-started/configuration
  //   // https://content.nuxt.com/docs/features/markdown-content
  //   // https://content.nuxt.com/docs/features/markdown-content#markdown-options
  // },
  runtimeConfig: {
    // Keys within public are also exposed client-side
    public: {
      appVersion: process.env.BUILD_TIME_APP_VERSION || '1.4.0',
    }
  }
})
