<template>
  <div class="test-page">
    <h1>API测试页面</h1>
    
    <div class="test-section">
      <h2>认证状态</h2>
      <div v-if="authLoading" class="loading">正在获取token...</div>
      <div v-else-if="authError" class="error">
        <p>认证失败: {{ authError }}</p>
        <button @click="retryAuth">重试</button>
      </div>
      <div v-else class="success">
        <p>✅ Token获取成功</p>
        <p>用户ID: {{ user?.uid }}</p>
        <p>邮箱: {{ user?.email }}</p>
      </div>
    </div>

    <div class="test-section">
      <h2>菜谱测试</h2>
      <div class="recipe-test">
        <input 
          v-model="testRecipeId" 
          type="number" 
          placeholder="输入菜谱ID (例如: 67)"
          class="recipe-input"
        />
        <button @click="testRecipe" :disabled="!accessToken || recipeLoading">
          {{ recipeLoading ? '加载中...' : '测试菜谱API' }}
        </button>
      </div>
      
      <div v-if="recipeError" class="error">
        菜谱获取失败: {{ recipeError }}
      </div>
      
      <div v-if="recipeData" class="recipe-result">
        <h3>菜谱信息:</h3>
        <p><strong>名称:</strong> {{ recipeData.name }}</p>
        <p><strong>描述:</strong> {{ recipeData.description }}</p>
        <p><strong>分类:</strong> {{ recipeData.category?.name }}</p>
        <p><strong>主料:</strong> {{ recipeData.ingredients?.join(', ') }}</p>
        <p><strong>辅料:</strong> {{ recipeData.supportings?.join(', ') }}</p>
        <p><strong>调料:</strong> {{ recipeData.seasonings?.join(', ') }}</p>
        
        <div class="action-buttons">
          <NuxtLink :to="`/recipe/${testRecipeId}`" class="view-detail-btn">
            查看详情页
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>快速链接</h2>
      <div class="quick-links">
        <NuxtLink to="/recipe/67" class="link-btn">查看菜谱67</NuxtLink>
        <NuxtLink to="/" class="link-btn">返回首页</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { accessToken, user, initAuth } = useAuth()
const { getRecipeDetail } = useRecipe()

// 认证状态
const authLoading = ref(true)
const authError = ref(null)

// 菜谱测试
const testRecipeId = ref(67)
const recipeLoading = ref(false)
const recipeError = ref(null)
const recipeData = ref(null)

// 初始化认证
const initializeAuth = async () => {
  try {
    authLoading.value = true
    authError.value = null
    await initAuth()
    console.log('认证初始化成功')
  } catch (error) {
    console.error('认证初始化失败:', error)
    authError.value = error.message || '认证失败'
  } finally {
    authLoading.value = false
  }
}

// 重试认证
const retryAuth = () => {
  initializeAuth()
}

// 测试菜谱API
const testRecipe = async () => {
  if (!testRecipeId.value) {
    alert('请输入菜谱ID')
    return
  }

  try {
    recipeLoading.value = true
    recipeError.value = null
    recipeData.value = null
    
    const data = await getRecipeDetail(testRecipeId.value)
    recipeData.value = data
    console.log('菜谱数据:', data)
  } catch (error) {
    console.error('获取菜谱失败:', error)
    recipeError.value = error.message || '获取菜谱失败'
  } finally {
    recipeLoading.value = false
  }
}

// 页面加载时初始化
onMounted(() => {
  initializeAuth()
})

// 设置页面标题
useHead({
  title: 'API测试页面 - 一键大厨'
})
</script>

<style scoped>
.test-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.test-section h2 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
}

.loading {
  color: #666;
  font-style: italic;
}

.error {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
}

.error button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;
}

.success {
  color: #27ae60;
  background: #f2fdf6;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #27ae60;
}

.recipe-test {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.recipe-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.recipe-input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #5a6fd8;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.recipe-result {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.recipe-result h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.recipe-result p {
  margin: 8px 0;
  line-height: 1.5;
}

.action-buttons {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.view-detail-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  display: inline-block;
  font-weight: 600;
  transition: transform 0.2s;
}

.view-detail-btn:hover {
  transform: translateY(-2px);
}

.quick-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.link-btn {
  background: #f8f9fa;
  color: #333;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 8px;
  border: 2px solid #dee2e6;
  transition: all 0.2s;
}

.link-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

@media (max-width: 600px) {
  .test-page {
    padding: 16px;
  }
  
  .recipe-test {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quick-links {
    flex-direction: column;
  }
}
</style>