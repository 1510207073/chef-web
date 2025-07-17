/**
 * App 启动器 Composable
 * 处理 Universal Links、Custom Schemes 和应用商店跳转
 */

export const useAppLauncher = () => {
  // 配置信息
  const config = {
    universalLinkBase: 'https://chef.wyld.cc/app',
    customScheme: 'onechef',
    appStore: {
      ios: 'https://apps.apple.com/app/id6738049391',
      android: 'https://play.google.com/store/apps/details?id=cc.wyld.chef' // 需要替换为实际的包名
    }
  }

  // 设备检测
  const detectDevice = () => {
    const userAgent = navigator.userAgent
    
    return {
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
      isChrome: /Chrome/.test(userAgent),
      isWeChat: /MicroMessenger/i.test(userAgent),
      isQQ: /QQ\//i.test(userAgent),
      isInApp: window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
    }
  }

  // 检测 App 是否已安装（通过页面焦点变化）
  const detectAppInstalled = (timeout = 3000) => {
    return new Promise((resolve) => {
      let appOpened = false
      const startTime = Date.now()

      const handleVisibilityChange = () => {
        if (document.hidden) {
          appOpened = true
          resolve(true)
        }
      }

      const handlePageHide = () => {
        appOpened = true
        resolve(true)
      }

      const handleBlur = () => {
        appOpened = true
        resolve(true)
      }

      // 添加事件监听
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('pagehide', handlePageHide)
      window.addEventListener('blur', handleBlur)

      // 超时检测
      setTimeout(() => {
        // 清理事件监听
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('pagehide', handlePageHide)
        window.removeEventListener('blur', handleBlur)

        const timeElapsed = Date.now() - startTime
        
        // 如果页面没有失去焦点且时间超过阈值，认为 App 未安装
        if (!appOpened && timeElapsed >= timeout) {
          resolve(false)
        } else if (!appOpened) {
          resolve(null) // 不确定状态
        }
      }, timeout)
    })
  }

  // 主要的启动函数
  const launchApp = async (path = '', options = {}) => {
    const device = detectDevice()
    const universalLink = `${config.universalLinkBase}${path}`
    const customSchemeUrl = `${config.customScheme}://${path.replace(/^\//, '')}`

    console.log('设备信息:', device)
    console.log('启动路径:', path)

    // iOS 设备处理
    if (device.isIOS) {
      if (device.isSafari && !device.isInApp) {
        // iOS Safari: 优先使用 Universal Links
        console.log('iOS Safari: 使用 Universal Links')
        return await handleUniversalLink(universalLink, config.appStore.ios)
      } else if (device.isWeChat || device.isQQ) {
        // 微信/QQ 内置浏览器: 引导用户在 Safari 中打开
        showOpenInSafariTip()
        return { success: false, reason: 'wechat_browser' }
      } else {
        // iOS 其他浏览器: 使用 Custom Scheme
        console.log('iOS 其他浏览器: 使用 Custom Scheme')
        return await handleCustomScheme(customSchemeUrl, config.appStore.ios)
      }
    }
    
    // Android 设备处理
    else if (device.isAndroid) {
      if (device.isWeChat || device.isQQ) {
        // 微信/QQ 内置浏览器: 引导用户在默认浏览器中打开
        showOpenInBrowserTip()
        return { success: false, reason: 'wechat_browser' }
      } else {
        // Android: 使用 Custom Scheme
        console.log('Android: 使用 Custom Scheme')
        return await handleCustomScheme(customSchemeUrl, config.appStore.android)
      }
    }
    
    // 其他平台
    else {
      console.log('其他平台: 使用 Custom Scheme')
      return await handleCustomScheme(customSchemeUrl, config.appStore.ios)
    }
  }

  // 处理 Universal Links
  const handleUniversalLink = async (universalLink, fallbackUrl) => {
    try {
      window.location.href = universalLink
      
      const appInstalled = await detectAppInstalled(3000)
      
      if (appInstalled === false) {
        // App 未安装，询问用户是否下载
        const userConfirm = confirm('未检测到一键大厨 App，是否前往 App Store 下载？')
        if (userConfirm) {
          window.location.href = fallbackUrl
          return { success: true, action: 'store_redirect' }
        }
        return { success: false, reason: 'user_cancelled' }
      }
      
      return { success: true, action: 'app_opened' }
    } catch (error) {
      console.error('Universal Link 启动失败:', error)
      return { success: false, reason: 'error', error }
    }
  }

  // 处理 Custom Scheme
  const handleCustomScheme = async (customSchemeUrl, fallbackUrl) => {
    try {
      window.location.href = customSchemeUrl
      
      const appInstalled = await detectAppInstalled(2000)
      
      if (appInstalled === false) {
        // App 未安装，自动跳转到应用商店
        window.location.href = fallbackUrl
        return { success: true, action: 'store_redirect' }
      }
      
      return { success: true, action: 'app_opened' }
    } catch (error) {
      console.error('Custom Scheme 启动失败:', error)
      return { success: false, reason: 'error', error }
    }
  }

  // 显示在 Safari 中打开的提示
  const showOpenInSafariTip = () => {
    alert('请点击右上角"..."按钮，选择"在Safari中打开"以获得最佳体验')
  }

  // 显示在浏览器中打开的提示
  const showOpenInBrowserTip = () => {
    alert('请点击右上角"..."按钮，选择"在浏览器中打开"以获得最佳体验')
  }

  // 生成智能横幅的 meta 标签
  const generateSmartBannerMeta = () => {
    return [
      {
        name: 'apple-itunes-app',
        content: 'app-id=6738049391, app-argument=https://chef.wyld.cc/app'
      }
    ]
  }

  return {
    launchApp,
    detectDevice,
    generateSmartBannerMeta,
    config
  }
}