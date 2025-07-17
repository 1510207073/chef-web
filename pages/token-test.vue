<template>
  <div class="token-test-page">
    <div class="container">
      <h1>Token 测试页面</h1>
      
      <div class="test-section">
        <h2>当前Token状态</h2>
        <div class="token-info">
          <p><strong>Access Token:</strong></p>
          <div class="token-display">
            {{ accessToken || '未获取到token' }}
          </div>
          
          <p><strong>Refresh Token:</strong></p>
          <div class="token-display">
            {{ refreshToken || '未获取到token' }}
          </div>
          
          <p><strong>用户信息:</strong></p>
          <div class="token-display">
            {{ user ? JSON.stringify(user, null, 2) : '未获取到用户信息' }}
          </div>
        </div>
      </div>
      
      <div class="test-section">
        <h2>操作</h2>
        <div class="actions">
          <button @click="testInitAuth" :disabled="loading" class="btn">
            {{ loading ? '初始化中...' : '初始化认证' }}
          </button>
          <button @click="testGetGuestToken" :disabled="loading" class="btn">
            {{ loading ? '获取中...' : '重新获取游客Token' }}
          </button>
          <button @click="clearTokens" class="btn btn-danger">
            清除所有Token
          </button>
        </div>
      </div>
      
      <div class="test-section">
        <h2>测试菜谱API</h2>
        <div class="api-test">
          <button @click="testRecipeAPI" :disabled="loading || !accessToken" class="btn">
            {{ loading ? '测试中...' : '测试获取菜谱详情' }}
          </button>
          <div v-if="apiResult" class="api-result">
            <h3>API响应:</h3>
            <pre>{{ JSON.stringify(apiResult, null, 2) }}</pre>
          </div>
          <div v-if="apiError" class="api-error">
            <h3>API错误:</h3>
            <pre>{{ apiError }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { accessToken, refreshToken, user, initAuth, getGuestToken } = useAuth()
const { getRecipeDetail } = useRecipe()

const loading = ref(false)
const apiResult = ref(null)
const apiError = ref(null)

// 测试初始化认证
const testInitAuth = async () => {
  loading.value = true
  try {
    await initAuth()
    console.log('初始化认证成功')
  } catch (error) {
    console.error('初始化认证失败:', error)
  } finally {
    loading.value = false
  }
}

// 测试获取游客token
const testGetGuestToken = async () => {
  loading.value = true
  try {
    await getGuestToken()
    console.log('获取游客token成功')
  } catch (error) {
    console.error('获取游客token失败:', error)
  } finally {
    loading.value = false
  }
}

// 清除所有token
const clearTokens = () => {
  if (process.client) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
    location.reload()
  }
}

// 测试菜谱API
const testRecipeAPI = async () => {
  loading.value = true
  apiResult.value = null
  apiError.value = null
  
  try {
    const result = await getRecipeDetail(67)
    apiResult.value = result
    console.log('菜谱API测试成功:', result)
  } catch (error) {
    apiError.value = error.message || error.toString()
    console.error('菜谱API测试失败:', error)
  } finally {
    loading.value = false
  }
}

// 页面挂载时自动初始化
onMounted(() => {
  testInitAuth()
})
</script>

<style scoped>
.token-test-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

h2 {
  color: #555;
  margin-bottom: 15px;
  border-bottom: 2px solid #ff6b6b;
  padding-bottom: 5px;
}

.test-section {
  margin-bottom: 30px;
}

.token-info p {
  margin: 10px 0 5px 0;
  font-weight: bold;
  color: #666;
}

.token-display {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
  font-family: monospace;
  font-size: 12px;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.btn:hover:not(:disabled) {
  background: #ff5252;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-danger {
  background: #dc3545;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.api-test {
  margin-top: 15px;
}

.api-result, .api-error {
  margin-top: 15px;
}

.api-result h3 {
  color: #28a745;
  margin-bottom: 10px;
}

.api-error h3 {
  color: #dc3545;
  margin-bottom: 10px;
}

.api-result pre, .api-error pre {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.api-error pre {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}
</style>