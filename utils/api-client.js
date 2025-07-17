// API 基础配置和拦截器
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'user-agent': 'Dart/3.8 (dart:io)',
      'content-type': 'application/json',
      'accept-encoding': 'gzip',
      'host': 'app-gateway.wyld.cc'
    }
    this.defaultQuery = {
      app_id: 'onechef',
      source: 'web',
    }
  }

  async request(endpoint, options = {}) {
    const { accessToken } = useAuth()
    
    const config = {
      method: options.method || 'GET',
      query: { ...this.defaultQuery, ...options.query },
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      ...options
    }

    // 自动添加认证头
    if (accessToken.value) {
      config.headers.authorization = `Bearer ${accessToken.value}`
    }

    try {
      return await $fetch(`${this.baseURL}${endpoint}`, config)
    } catch (error) {
      // 统一错误处理
      if (error.status === 401) {
        // Token 过期，尝试刷新
        await this.refreshToken()
        return this.request(endpoint, options)
      }
      throw error
    }
  }

  async refreshToken() {
    // Token 刷新逻辑
    const { refreshToken, getGuestToken } = useAuth()
    
    if (!refreshToken.value) {
      // 如果没有 refresh token，重新获取游客 token
      await getGuestToken()
      return
    }
    
    // 实现 refresh token 逻辑
  }
}

export const apiClient = new ApiClient('https://app-gateway.wyld.cc/api/v1')

// 使用示例
export const useRecipeAPI = () => {
  return {
    getRecipeDetail: (id) => apiClient.request(`/onechef/recipe/${id}`),
    getRecipeList: (params) => apiClient.request('/onechef/recipes', { query: params }),
    // 其他 API 方法...
  }
}