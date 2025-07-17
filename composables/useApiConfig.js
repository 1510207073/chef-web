/**
 * API 配置管理
 * 统一管理所有 API 相关的配置
 */

export const useApiConfig = () => {
  const config = useRuntimeConfig()

  // 环境检测
  const isDev = process.dev || process.env.NODE_ENV === 'development'
  
  // API 基础配置
  const apiConfig = {
    baseURL: isDev 
      ? 'http://localhost:3000/api/v1'  // 开发环境使用代理
      : (config.public.apiBaseUrl || 'https://app-gateway.wyld.cc/api/v1'), // 生产环境使用实际地址
    host: config.public.apiHost || 'app-gateway.wyld.cc',
  }

  // 应用配置
  const appConfig = {
    id: config.public.appId || 'onechef',
    source: config.public.appSource || 'app',
  }

  // Universal Links 配置
  const linkConfig = {
    universalLinkBase: config.public.universalLinkBase || 'https://chef.wyld.cc/app',
    customScheme: config.public.customScheme || 'onechef',
  }

  // App Store 配置
  const storeConfig = {
    ios: {
      appId: config.public.iosAppId || '6748383363',
      storeUrl: config.public.iosAppStoreUrl || 'https://apps.apple.com/app/id6748383363',
    },
    android: {
      packageName: config.public.androidPackageName || 'com.bitrhythm.chef',
      storeUrl: config.public.androidPlayStoreUrl || 'https://play.google.com/store/apps/details?id=com.bitrhythm.chef',
    }
  }

  // 默认请求头
  const getDefaultHeaders = () => ({
    'user-agent': 'Dart/3.8 (dart:io)',
    'content-type': 'application/json',
    'accept-encoding': 'gzip',
    'host': apiConfig.host
  })

  // 默认查询参数
  const getDefaultQuery = () => ({
    app_id: appConfig.id,
    source: appConfig.source,
  })

  // 构建完整的 API URL
  const buildApiUrl = (endpoint) => {
    return `${apiConfig.baseURL}${endpoint}`
  }

  // 构建 Universal Link
  const buildUniversalLink = (path = '') => {
    return `${linkConfig.universalLinkBase}${path}`
  }

  // 构建 Custom Scheme URL
  const buildCustomSchemeUrl = (path = '') => {
    const cleanPath = path.replace(/^\//, '')
    return `${linkConfig.customScheme}://${cleanPath}`
  }

  // 环境检测
  const getEnvironment = () => {
    if (process.env.NODE_ENV === 'production') {
      return 'production'
    } else if (process.env.NODE_ENV === 'development') {
      return 'development'
    } else {
      return 'test'
    }
  }

  // 是否为开发环境
  const isDevelopment = () => getEnvironment() === 'development'

  // 是否为生产环境
  const isProduction = () => getEnvironment() === 'production'

  // 调试信息
  const getDebugInfo = () => {
    if (isDevelopment()) {
      return {
        environment: getEnvironment(),
        apiConfig,
        appConfig,
        linkConfig,
        storeConfig
      }
    }
    return null
  }

  return {
    // 配置对象
    apiConfig,
    appConfig,
    linkConfig,
    storeConfig,
    
    // 工具方法
    getDefaultHeaders,
    getDefaultQuery,
    buildApiUrl,
    buildUniversalLink,
    buildCustomSchemeUrl,
    
    // 环境方法
    getEnvironment,
    isDevelopment,
    isProduction,
    getDebugInfo
  }
}