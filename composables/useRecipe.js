export const useRecipe = () => {
  const { buildApiUrl, getDefaultHeaders, getDefaultQuery } = useApiConfig()
  const { accessToken } = useAuth()

  // 获取菜谱详情
  const getRecipeDetail = async (recipeId) => {
    try {
      const response = await $fetch(buildApiUrl(`/onechef/recipe/${recipeId}`), {
        method: 'GET',
        query: getDefaultQuery(),
        headers: {
          ...getDefaultHeaders(),
          ...(accessToken.value && { 'authorization': `Bearer ${accessToken.value}` })
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