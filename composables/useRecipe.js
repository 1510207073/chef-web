export const useRecipe = () => {
  // 获取菜谱详情
  const getRecipeDetail = async (recipeId) => {
    try {
      // 动态获取当前的accessToken
      const { accessToken } = useAuth()
      
      console.log('useRecipe中获取到的accessToken:', accessToken.value)
      
      if (!accessToken.value) {
        throw new Error('未获取到访问token')
      }

      const response = await $fetch(`https://tool-internal.wyld.cc/api/v1/onechef/recipe/${recipeId}`, {
        method: 'GET',
        query: {
          app_id: 'onechef',
          app_version: '1.1.0',
          source: 'app',
          os: 'ios',
          os_version: '18.5',
          device: 'iPhone',
          device_version: '18.5'
        },
        headers: {
          'user-agent': 'Dart/3.8 (dart:io)',
          'content-type': 'application/json',
          'accept-encoding': 'gzip',
          'authorization': `Bearer ${accessToken.value}`,
          'host': 'tool-internal.wyld.cc'
        }
      })

      return response
    } catch (error) {
      console.error('获取菜谱详情失败:', error)
      throw error
    }
  }

  return {
    getRecipeDetail
  }
}