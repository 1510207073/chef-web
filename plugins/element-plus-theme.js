// Element Plus主题插件
import '../assets/scss/element-variables.scss'

export default defineNuxtPlugin(() => {
  // 只引入主题，Element Plus模块已由@element-plus/nuxt插件注册
  console.log('Element Plus自定义主题已加载')
}) 