<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="logo">BitRhythm</div>
      <nav>
        <ul>
          <li><a href="#home">首页</a></li>
          <li><a href="#features">简介</a></li>
          <li><a href="#about">关于我们</a></li>
        </ul>
      </nav>
    </header>

    <!-- 内容区 -->
    <main>
      <!-- 第一部分：标题、简介和下载按钮 -->
      <section id="home" class="hero-section">
        <div class="hero-content">
          <h1>一键大厨</h1>
          <p class="description">您的智能烹饪助手，让每个人都能轻松做出美味佳肴</p>
          <div class="download-buttons">
            <button class="download-btn android">
              <i class="btn-icon">📱</i> Android下载
            </button>
            <button class="download-btn ios">
              <i class="btn-icon">📱</i> iOS下载
            </button>
          </div>
        </div>
      </section>

      <!-- 第二部分：项目亮点和特色 -->
      <section id="features" class="features-section">
        <h2>产品特色</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">🍳</div>
            <h3>智能菜谱</h3>
            <p>上千种精选菜谱，一键即可查看详细步骤</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⏱️</div>
            <h3>时间管理</h3>
            <p>精确烹饪时间控制，再也不会做糊菜</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h3>营养分析</h3>
            <p>详细的营养成分分析，吃得健康又美味</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔍</div>
            <h3>食材识别</h3>
            <p>智能识别食材，推荐可制作的美食</p>
          </div>
        </div>
      </section>

      <!-- 第三部分：关于我们 -->
      <section id="about" class="about-section">
        <h2>关于我们</h2>
        <div class="about-content">
          <p>BitRhythm 是一家致力于改变人们烹饪体验的科技公司。我们相信，通过先进的技术和精心设计的用户体验，每个人都能轻松掌握烹饪技巧，享受美食带来的乐趣。</p>
          <p>我们的团队由一群热爱美食和技术的专业人士组成，致力于为用户提供最好的烹饪助手应用。</p>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer>
      <p>Copyright © 2025 BitRhythm.</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f5f7;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 70%;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6b6b;
}

nav ul {
  display: flex;
  list-style: none;
}

nav li {
  margin-left: 2rem;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover {
  color: #ff6b6b;
}

/* 内容区样式 */
main {
  flex: 1;
}

/* 第一部分：英雄区域 */
.hero-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.hero-content {
  text-align: center;
  max-width: 800px;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}

.download-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.download-btn {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.android {
  background-color: #4CAF50;
  color: white;
}

.ios {
  background-color: #2196F3;
  color: white;
}

.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  margin-right: 10px;
}

/* 第二部分：特色功能 */
.features-section {
  min-height: 100vh;
  padding: 5rem 2rem;
  background-color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.features-section h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-item {
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-item p {
  color: #666;
}

/* 第三部分：关于我们 */
.about-section {
  min-height: 100vh;
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #dfe6e9 100%);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.about-section h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-content p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #555;
}

/* 页脚样式 */
footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}

/* 平滑滚动效果 */
html {
  scroll-behavior: smooth;
}
</style>
