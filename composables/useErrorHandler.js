// 全局错误处理 composable
export const useErrorHandler = () => {
  const toast = useToast() // 假设使用 toast 组件

  const handleError = (error, context = '') => {
    console.error(`${context}错误:`, error)
    
    // 根据错误类型显示不同的用户友好消息
    let message = '操作失败，请稍后重试'
    
    if (error.status === 401) {
      message = '登录已过期，请重新登录'
    } else if (error.status === 403) {
      message = '没有权限执行此操作'
    } else if (error.status === 404) {
      message = '请求的资源不存在'
    } else if (error.status >= 500) {
      message = '服务器错误，请稍后重试'
    } else if (error.message) {
      message = error.message
    }

    toast.error(message)
    
    // 可以添加错误上报逻辑
    // reportError(error, context)
  }

  const withErrorHandling = async (asyncFn, context = '') => {
    try {
      return await asyncFn()
    } catch (error) {
      handleError(error, context)
      throw error
    }
  }

  return {
    handleError,
    withErrorHandling
  }
}

// 重试机制 composable
export const useRetry = () => {
  const retry = async (fn, maxAttempts = 3, delay = 1000) => {
    let lastError
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (attempt === maxAttempts) {
          throw error
        }
        
        // 指数退避
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
      }
    }
    
    throw lastError
  }

  return { retry }
}