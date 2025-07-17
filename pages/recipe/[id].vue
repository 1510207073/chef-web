<template>
  <div class="recipe-detail-page">
    <!-- 加载状态 -->
    <div v-if="pending" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载菜谱...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>加载失败</h3>
      <p>{{ error.message || '获取菜谱信息失败，请稍后重试' }}</p>
      <button @click="refresh()" class="retry-btn">重试</button>
    </div>

    <!-- 菜谱详情 -->
    <div v-else-if="recipe" class="recipe-content">
      <!-- 封面图片 -->
      <div class="cover-section">
        <img 
          :src="recipe.cover?.file_url" 
          :alt="recipe.name"
          class="cover-image"
          @error="handleImageError"
        />
        <div class="cover-overlay">
          <h1 class="recipe-title">{{ recipe.name }}</h1>
          <!-- <div class="recipe-meta">
            <div class="likes"> 
              <span class="heart-icon">♥</span>
              <span>{{ recipe.like_info?.count || 0 }}</span>
            </div>
          </div> -->
        </div>
      </div>

      <!-- 作者信息 -->
      <div class="author-section">
        <div class="author-info">
          <img 
            :src="recipe.user?.avatar_url" 
            :alt="recipe.user?.nickname"
            class="author-avatar"
            @error="handleAvatarError"
          />
          <div class="author-details">
            <h4 class="author-name">{{ recipe.user?.nickname }}</h4>
            <p class="author-intro">{{ recipe.user?.intro }}</p>
          </div>
        </div>
      </div>

      <!-- 菜谱描述 -->
      <div class="description-section">
        <p class="description">{{ recipe.description }}</p>
      </div>

      <!-- 材料部分 -->
      <div class="ingredients-section">
        
        <!-- 主料 -->
        <div v-if="recipe.ingredients?.length" class="ingredient-group">
          <h3 class="group-title">主料</h3>
          <div class="ingredient-list">
            <div 
              v-for="ingredient in recipe.ingredients" 
              :key="ingredient"
              class="ingredient-item main-ingredient"
            >
              <span class="ingredient-dot"></span>
              <span class="ingredient-name">{{ ingredient }}</span>
            </div>
          </div>
        </div>

        <!-- 辅料 -->
        <div v-if="recipe.supportings?.length" class="ingredient-group">
          <h3 class="group-title">辅料</h3>
          <div class="ingredient-list">
            <div 
              v-for="supporting in recipe.supportings" 
              :key="supporting"
              class="ingredient-item supporting-ingredient"
            >
              <span class="ingredient-dot"></span>
              <span class="ingredient-name">{{ supporting }}</span>
            </div>
          </div>
        </div>

        <!-- 调料 -->
        <div v-if="recipe.seasonings?.length" class="ingredient-group">
          <h3 class="group-title">调料</h3>
          <div class="ingredient-list">
            <div 
              v-for="seasoning in recipe.seasonings" 
              :key="seasoning"
              class="ingredient-item seasoning-ingredient"
            >
              <span class="ingredient-dot"></span>
              <span class="ingredient-name">{{ seasoning }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-action">
      <button @click="openInApp" class="open-app-btn">
        打开 APP 查看更多
      </button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { initAuth, accessToken } = useAuth()
const { getRecipeDetail } = useRecipe()

// 获取菜谱ID
const recipeId = computed(() => route.params.id)

// 数据状态
const recipe = ref(null)
const pending = ref(true)
const error = ref(null)

// 获取菜谱数据的函数
const fetchRecipeData = async () => {
  try {
    pending.value = true
    error.value = null
    
    // 确保已获取token
    await initAuth()
    
    // 等待一小段时间确保token已设置
    await nextTick()
    
    console.log('当前accessToken:', accessToken.value)
    
    if (!accessToken.value) {
      throw new Error('未获取到访问token，请稍后重试')
    }
    
    // 获取菜谱详情
    const data = await getRecipeDetail(recipeId.value)
    recipe.value = data
    console.log('菜谱数据获取成功:', data)
  } catch (err) {
    console.error('获取菜谱失败:', err)
    error.value = err
  } finally {
    pending.value = false
  }
}

// 重试函数
const refresh = () => {
  fetchRecipeData()
}

// 页面挂载时获取数据
onMounted(() => {
  fetchRecipeData()
})

// 设置页面元信息
useHead(() => ({
  title: recipe.value ? `${recipe.value.name} - 一键大厨` : '菜谱详情 - 一键大厨',
  meta: [
    {
      name: 'description',
      content: recipe.value?.description || '查看美味菜谱的详细制作方法'
    },
    // iOS Smart Banner - Apple 官方推荐的 App 推广方式
    {
      name: 'apple-itunes-app',
      content: `app-id=6748383363, app-argument=https://chef.wyld.cc/app/recipe/${recipeId.value}`
    },
    // 微信分享优化
    {
      property: 'og:title',
      content: recipe.value?.name || '美味菜谱'
    },
    {
      property: 'og:description',
      content: recipe.value?.description || '查看美味菜谱的详细制作方法'
    },
    {
      property: 'og:image',
      content: recipe.value?.cover?.file_url || ''
    },
    // Universal Links 支持
    {
      property: 'al:ios:url',
      content: `onechef://recipe/${recipeId.value}`
    },
    {
      property: 'al:ios:app_store_id',
      content: '6748383363'
    },
    {
      property: 'al:ios:app_name',
      content: '一键大厨'
    }
  ]
}))

// 打开APP
const { launchApp } = useAppLauncher()

const openInApp = async () => {
  try {
    const result = await launchApp(`/recipe/${recipeId.value}`)
    console.log('App 启动结果:', result)
    
    if (!result.success) {
      switch (result.reason) {
        case 'wechat_browser':
          // 微信浏览器中的处理已在 launchApp 中完成
          break
        case 'user_cancelled':
          console.log('用户取消了下载')
          break
        case 'error':
          console.error('启动失败:', result.error)
          // 可以显示错误提示
          break
      }
    }
  } catch (error) {
    console.error('App 启动异常:', error)
  }
}

// 图片加载错误处理
const handleImageError = (event) => {
  event.target.src = '/images/placeholder-recipe.svg'
}

const handleAvatarError = (event) => {
  event.target.src = '/images/placeholder-avatar.svg'
}
</script>

<style scoped>
.recipe-detail-page {
  min-height: 100vh;
  background: white;
  padding-bottom: 100px; /* 为底部按钮留出空间 */
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #ff5252;
}

/* 封面部分 */
.cover-section {
  position: relative;
  width: 100%;
  height: 60vh;
  min-height: 300px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 40px 20px 20px;
  color: white;
}

.recipe-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 12px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.recipe-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.category {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.likes {
  font-size: 14px;
}

/* 内容区域 */
.recipe-content {
  background: white;
  margin-top: -20px;
  border-radius: 20px 20px 0 0;
  position: relative;
  z-index: 1;
}

/* 作者信息 */
.author-section {
  padding: 20px;
  background: white;
  border-radius: 12px;
  /* margin: 16px 0; */
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.author-details {
  flex: 1;
}

.author-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.author-intro {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* 描述部分 */
.description-section {
  /* padding: 20px; */
  background: white;
  border-radius: 12px;
  /* margin: 16px 0; */
}

.description {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

/* 点赞图标样式修复 */
.heart-icon {
  color: #ff6b6b;
  font-size: 18px;
  margin-right: 4px;
  display: inline-block;
}

/* 材料部分 */
.ingredients-section {
  padding: 24px 20px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ingredient-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin: 0 0 12px 0;
  padding-left: 8px;
}

.ingredient-list {
  display: flex;
  flex-direction: column;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  transition: transform 0.2s ease;
}

.ingredient-item:hover {
  transform: translateY(-2px);
}

.ingredient-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.main-ingredient .ingredient-dot {
  background: #EA4D3D;
}

.supporting-ingredient .ingredient-dot {
  background: #64C366;
}

.seasoning-ingredient .ingredient-dot {
  background: #ffa726;
}

.ingredient-name {
  color: #333;
  font-weight: 500;
}

/* 标签部分 */
.tags-section {
  padding: 0 20px 24px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  gap: 12px;
  background: #f8d8d5;
  color: #EA4D3D;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
}

/* 底部按钮 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: white;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 100;
}

.open-app-btn {
  width: 100%;
  background: #EA4D3D;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.open-app-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.open-app-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recipe-title {
    font-size: 24px;
  }
  
  .cover-section {
    height: 50vh;
    min-height: 250px;
  }
  
  .ingredient-list {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
  }
  
  .ingredient-item {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .section-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .cover-overlay {
    padding: 30px 16px 16px;
  }
  
  .recipe-title {
    font-size: 20px;
  }
  
  .description-section,
  .ingredients-section {
    padding: 10px 16px;
  }
  
  .bottom-action {
    padding: 16px;
  }
  
  .open-app-btn {
    font-size: 16px;
    padding: 14px 20px;
  }
}
</style>