// 全局状态，确保在所有组件间共享
const globalAccessToken = ref(null)
const globalRefreshToken = ref(null)
const globalUser = ref(null)

export const useAuth = () => {
  const { buildApiUrl, getDefaultHeaders, getDefaultQuery } = useApiConfig()

  // 获取游客token
  const getGuestToken = async () => {
    try {
      const response = await $fetch(buildApiUrl('/auth/token/guest'), {
        method: 'POST',
        query: getDefaultQuery(),
        headers: getDefaultHeaders(),
        body: {
          ident: null
        }
      })

      if (response.access && response.refresh) {
        globalAccessToken.value = response.access
        globalRefreshToken.value = response.refresh
        globalUser.value = response.user

        // 保存到本地存储
        if (process.client) {
          localStorage.setItem('access_token', response.access)
          localStorage.setItem('refresh_token', response.refresh)
          localStorage.setItem('user_info', JSON.stringify(response.user))
        }

        return response
      }
    } catch (error) {
      console.error('获取游客token失败:', error)
      throw error
    }
  }

  // 从本地存储加载token
  const loadTokenFromStorage = () => {
    if (process.client) {
      const storedAccessToken = localStorage.getItem('access_token')
      const storedRefreshToken = localStorage.getItem('refresh_token')
      const storedUser = localStorage.getItem('user_info')

      if (storedAccessToken) {
        globalAccessToken.value = storedAccessToken
        console.log('从本地存储加载token成功:', storedAccessToken)
      }
      if (storedRefreshToken) {
        globalRefreshToken.value = storedRefreshToken
      }
      if (storedUser) {
        try {
          globalUser.value = JSON.parse(storedUser)
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
    }
  }

  // 初始化认证
  const initAuth = async () => {
    try {
      // 首先从本地存储加载token
      loadTokenFromStorage()
      
      // 如果没有token，获取游客token
      if (!globalAccessToken.value) {
        console.log('本地没有token，正在获取游客token...')
        await getGuestToken()
        console.log('游客token获取成功:', globalAccessToken.value)
      } else {
        console.log('从本地存储加载token成功:', globalAccessToken.value)
      }
      
      return globalAccessToken.value
    } catch (error) {
      console.error('初始化认证失败:', error)
      throw error
    }
  }

  return {
    accessToken: readonly(globalAccessToken),
    refreshToken: readonly(globalRefreshToken),
    user: readonly(globalUser),
    getGuestToken,
    loadTokenFromStorage,
    initAuth
  }
}