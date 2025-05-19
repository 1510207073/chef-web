<template>
    <div class="app-container">
      <!-- 添加页面预加载遮罩，在GSAP动画开始前隐藏内容 -->
      <div class="page-loader">
        <div class="loader-content">
          <div class="loader-spinner"></div>
        </div>
      </div>
      
      <header class="header">
        <div class="container">
          <div class="logo-section">
            <a href="#" class="logo-link">
              <div class="logo-container">
                <img src="/images/logo.png" alt="一键大厨Logo" class="nav-logo" />
                <div class="logo-text-container">
                  <h1 class="logo-text">一键<span class="logo-text-highlight">大厨</span></h1>
                </div>
              </div>
            </a>
          </div>
          <nav class="navigation">
            <ul>
              <!-- 隐藏导航链接 -->
            </ul>
          </nav>
        </div>
      </header>
  

  
      <Swiper
        :modules="[Mousewheel, Pagination, Autoplay]"
        :direction="'vertical'"
        :slides-per-view="1"
        :space-between="0"
        :mousewheel="true"
        :pagination="{
          clickable: true,
          el: null
        }"
        :autoplay="false"
        :speed="800"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="main-swiper"
      >
        <SwiperSlide>
          <section id="hero" class="section hero-section" data-section="hero">
            <div class="animated-background">
              <div class="bg-gradient"></div>
              <div class="bg-pattern"></div>
              <div class="bg-shape shape1"></div>
              <div class="bg-shape shape2"></div>
              <div class="bg-shape shape3"></div>
              <div class="kitchen-icon icon1"></div>
              <div class="kitchen-icon icon2"></div>
            </div>
            <div class="container">
              <div class="hero-content">
                <h2 class="hero-title gradient-text gsap-title">一键大厨 - 轻松学做美食</h2>
                <p class="hero-description gsap-desc typing-effect" ref="typeText"></p>
                <div class="cta-buttons gsap-buttons">
                  <a href="#" class="app-store-btn">
                    <div class="store-btn">
                      <img src="/images/appstore.svg" alt="App Store" />
                      <span>iOS 下载</span>
                    </div>
                  </a>
                  <a href="#" class="android-btn">
                    <div class="store-btn">
                      <img src="/images/android.svg" alt="Android" />
                      <span>Android 下载</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
      </Swiper>
  
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-links">
              <span class="copyright">Copyright © 2025 BitRhythm</span>
              <span class="footer-separator">|</span>
              <a href="/terms" target="_blank" rel="noopener noreferrer" class="footer-link">使用条款</a>
              <span class="footer-separator">|</span>
              <a href="/privacy" target="_blank" rel="noopener noreferrer" class="footer-link">隐私政策</a>
              <span class="footer-separator">|</span>
              <a href="mailto:developer@wyld.cc" class="footer-link">联系我们: developer@wyld.cc</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
  import { useRuntimeConfig } from '#app';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay, Pagination, Mousewheel } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/pagination';
  
  const swiperInstance = ref(null);
  const activeIndex = ref(0);
  const sections = ['hero'];
  const config = useRuntimeConfig();
  const appVersion = config.public.appVersion;
  const detectedArch = ref(null);
  const typeText = ref(null);
  const textToType = "隔空手势操作，边学边做，秒变大厨";
  const archDisplay = computed(() => {
    return detectedArch.value === 'arm64' ? 'Apple Silicon' : 'Intel';
  });
  const macDownloadUrl = computed(() => {
    const version = appVersion;
    const arch = detectedArch.value === 'arm64' ? 'arm64' : 'x64';
    const filename = `OneKeyChef_${version}_${arch}.zip`;
    const baseUrl = `https://wyld-media.oss-cn-beijing.aliyuncs.com/onekeychef/update/v${version}/mac/${filename}`;
    return baseUrl;
  });

  const windowsDownloadUrl = computed(() => {
    const version = appVersion;
    // Link to the .zip file as requested
    const filename = `OneKeyChef_${version}.zip`; 
    // Construct the path similar to macOS, using the versioned subdirectory
    const baseUrl = `https://wyld-media.oss-cn-beijing.aliyuncs.com/onekeychef/update/v${version}/win/${filename}`;
    return baseUrl;
  });

  function detectArch() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('mac') && navigator.userAgentData) {
      try {
        navigator.userAgentData.getHighEntropyValues(['architecture', 'platform', 'platformVersion'])
          .then(ua => {
            if (ua.architecture === 'arm' || ua.architecture === 'arm64') {
              detectedArch.value = 'arm64';
            } else {
              detectedArch.value = 'x64';
            }
          })
          .catch(() => {
            fallbackArchDetection();
          });
      } catch (e) {
        fallbackArchDetection();
      }
    } else {
      fallbackArchDetection();
    }
  }
  function fallbackArchDetection() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (
      (userAgent.includes('mac') && navigator.hardwareConcurrency > 8) ||
      userAgent.includes('macintosh') && /(apple.*silicon|m1|m2)/i.test(userAgent)
    ) {
      detectedArch.value = 'arm64';
    } else if (userAgent.includes('mac') || userAgent.includes('macintosh')) {
      detectedArch.value = 'x64';
    } else {
      detectedArch.value = 'universal';
    }
  }
  function trackDownload(platform, arch) {
    console.log(`用户下载 ${platform} 版本，架构: ${arch}`);
  }
  
  // 打字效果实现
  let typeTimer = null;
  
  function initTypeEffect() {
    if (typeText.value) {
          // 不再需要处理光标显示
    // if (typeText.value) {
    //   typeText.value.classList.remove('typing-active');
    // }
      
      // 延迟一小段时间再开始打字效果
      setTimeout(() => {
        runTypeEffect();
        
        // 每10秒重新执行一次
        typeTimer = setInterval(() => {
          // 不再需要处理光标显示
          // if (typeText.value) {
          //   typeText.value.classList.remove('typing-active');
          // }
          
          runTypeEffect();
        }, 10000);
      }, 500); // 增加延迟，确保GSAP动画充分完成
    }
  }
  
  function runTypeEffect() {
    if (!typeText.value) return;
    
    const textElement = typeText.value;
    textElement.textContent = '';
    textElement.style.visibility = 'visible'; // 确保描述区域可见
    
    // 先用透明文本占位，保证高度，但不显示光标
    textElement.classList.remove('typing-active');
    textElement.innerHTML = `<span style="visibility:hidden;">${textToType}</span>`;
    
    let charIndex = 0;
    
    // 清除之前可能存在的typing定时器
    if (window.typingInterval) {
      clearInterval(window.typingInterval);
    }
    
          // 开始打字前添加短暂延迟
      setTimeout(() => {
        // 不再添加显示光标的类
        // textElement.classList.add('typing-active');
      
      // 逐个字符打印
      window.typingInterval = setInterval(() => {
        if (charIndex < textToType.length) {
          // 替换占位文本
          textElement.innerHTML = `${textToType.substring(0, charIndex + 1)}`;
          charIndex++;
        } else {
          clearInterval(window.typingInterval);
        }
      }, 100); // 调整打字速度
    }, 200);
  }
  
  const onSwiper = (swiper) => {
    swiperInstance.value = swiper;
  };
  const onSlideChange = () => {
    if (swiperInstance.value) activeIndex.value = swiperInstance.value.activeIndex;
  };
  const navigateToSlide = (index) => {
    if (swiperInstance.value) swiperInstance.value.slideTo(index);
  };

  // 页面加载后初始化GSAP动画
  function initGSAPAnimations() {
    // 确保GSAP已经加载
    if (typeof gsap !== 'undefined') {
      // 创建动画时间线
      const tl = gsap.timeline({
        defaults: { 
          ease: "power2.out", 
          duration: 1
        },
        onComplete: () => {
          // GSAP动画完成后执行打字效果
          console.log("GSAP动画完成，开始执行打字效果");
          initTypeEffect();
        }
      });

      // 元素初始状态已在CSS中设置，这里保持一致
      // 这些设置与CSS预设相同，确保在不同浏览器中一致性
      gsap.set('.gsap-title', { opacity: 0, y: -50, scale: 0.9 });
      gsap.set('.gsap-desc', { opacity: 0, x: -30, visibility: 'hidden' });
      gsap.set('.gsap-buttons', { opacity: 0, y: 30 });

      // 添加动画序列
      tl.to('.gsap-title', { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 1.2
      })
      .to('.gsap-desc', { 
        opacity: 1, 
        x: 0,
        visibility: 'visible',
        duration: 1
      }, "-=0.7") // 描述在标题动画70%时开始
      .to('.gsap-buttons', { 
        opacity: 1, 
        y: 0,
        duration: 0.8
      }, "-=0.5") // 按钮在描述动画50%时开始
      .call(() => {
        // 动画完成后隐藏加载遮罩
        const pageLoaderElement = document.querySelector('.page-loader');
        if (pageLoaderElement) {
          gsap.to(pageLoaderElement, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              if (pageLoaderElement) {
                pageLoaderElement.style.display = 'none';
              }
            }
          });
        }
      });
    }
  }

  onMounted(() => {
    // 先显示加载遮罩
    if (document.querySelector('.page-loader')) {
      document.querySelector('.page-loader').style.display = 'flex';
    }
    
    console.log('Runtime config (public):', JSON.stringify(config.public, null, 2));
    document.querySelector('.scroll-to')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSlide(2);
    });
    detectArch();
    
    // 打字效果将在GSAP动画完成后初始化
    // 不再直接在这里调用initTypeEffect
    
    // 添加favicon，确保在各种环境下都能正确显示
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'shortcut icon';
    faviconLink.type = 'image/x-icon';
    faviconLink.href = '/favicon.ico';
    document.head.appendChild(faviconLink);
    
    // 添加更多尺寸的favicon和苹果设备图标
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/images/logo.png';
    document.head.appendChild(appleTouchIcon);
  
    // 加载本地字体
    const fontStyle = document.createElement('style');
    // 字体文件使用绝对路径
    const basePath = '';
    
    console.log('当前环境:', { 
      hostname: window.location.hostname, 
      pathname: window.location.pathname,
      fontPath: `${basePath}/font/customfont.ttf`
    });
    
    // 使用OSS上的字体文件
    fontStyle.textContent = `
      @font-face {
        font-family: 'CustomFont';
        src: url('https://media.wyld.cc/onetap-chef/static/%E5%AD%97%E5%B8%AE%E7%8E%A9%E9%85%B7%E4%BD%93.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: fallback;
      }
      
      /* 添加字体载入过渡效果 */
      .font-loading * {
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      
      .fonts-loaded * {
        opacity: 1;
      }
      
      /* 定义备用字体 */
      :root {
        --main-font: 'CustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        --title-font: 'CustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
    `;
    document.head.appendChild(fontStyle);
    
    // 字体预加载
    document.body.classList.add('font-loading');
    
    // 加载字体并在完成后移除加载类
    const fontUrl = `https://media.wyld.cc/onetap-chef/static/%E5%AD%97%E5%B8%AE%E7%8E%A9%E9%85%B7%E4%BD%93.ttf`;
    console.log('尝试加载字体:', fontUrl);
    
    // 增加字体加载超时处理
    let fontLoaded = false;
    const fontLoadTimeout = setTimeout(() => {
      if (!fontLoaded) {
        console.log('字体加载超时，使用系统字体');
        document.body.classList.remove('font-loading');
      }
    }, 3000); // 3秒超时
    
    // 尝试加载自定义字体
    const font = new FontFace('CustomFont', `url(${fontUrl})`);
    
    font.load()
      .then(loadedFont => {
        console.log('字体加载成功!');
        fontLoaded = true;
        clearTimeout(fontLoadTimeout);
        
        // 注册字体
        document.fonts.add(loadedFont);
        
        // 标记字体已加载
        setTimeout(() => {
          document.body.classList.remove('font-loading');
          document.body.classList.add('fonts-loaded');
        }, 100);
      })
      .catch(err => {
        console.error('字体加载失败:', err);
        console.log('尝试使用备用字体');
        
        // 清除超时计时器
        clearTimeout(fontLoadTimeout);
        fontLoaded = true;
        
        // 加载失败时使用备用字体
        const backupStyle = document.createElement('style');
        backupStyle.textContent = `
          :root {
            --main-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            --title-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
        `;
        document.head.appendChild(backupStyle);
        
        // 即使失败也移除加载状态
        document.body.classList.remove('font-loading');
        document.body.classList.add('fonts-loaded');
      });
    
    // 动态加载GSAP库
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = initGSAPAnimations;
    document.head.appendChild(script);
  });
  
  // 在组件卸载时清除定时器
  onUnmounted(() => {
    if (typeTimer) {
      clearInterval(typeTimer);
    }
    if (window.typingInterval) {
      clearInterval(window.typingInterval);
    }
  });
  </script>
  
  <style>
  :root {
    --primary-color: #ffffff;
    --secondary-color: #EA3E40;
    --light-text: #ffffff;
    --dark-text: #333333;
    --border-color: rgba(0, 0, 0, 0.1);
    --card-bg: rgba(255, 255, 255, 0.8);
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --main-font: 'CustomFont', -apple-system, BlinkMacSystemFont, sans-serif;
    --title-font: 'CustomFont', sans-serif;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    height: 100%;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overscroll-behavior: contain;
  }
  
  html::-webkit-scrollbar {
    display: none;
  }
  
  body {
    font-family: var(--main-font);
    line-height: 1.6;
    color: var(--dark-text);
    background-color: var(--primary-color);
    min-height: 100%;
    overflow: hidden;
  }
  
  a {
    text-decoration: none;
    color: var(--secondary-color);
  }
  
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100vh;
    overflow: hidden;
  }
  
  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Swiper 相关样式 */
  .main-swiper {
    width: 100%;
    height: calc(100vh - 160px);
    margin-top: 80px;
  }
  
  .swiper-slide {
    overflow: auto; /* 允许内容滚动 */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .swiper-slide::-webkit-scrollbar {
    display: none;
  }
  
  .swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.5);
  }
  
  .swiper-pagination-bullet-active {
    background: var(--secondary-color);
  }
  
  /* 自定义指示器样式 */
  .custom-indicators {
    position: fixed;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 100;
  }
  
  .indicator-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .indicator-dot:hover {
    background-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.2);
  }
  
  .indicator-dot.active {
    background-color: var(--secondary-color);
    transform: scale(1.2);
    box-shadow: 0 0 10px rgba(234, 62, 64, 0.5);
  }
  
  .text-center {
    text-align: center;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .mb-3 {
    margin-bottom: 1rem;
  }
  
  .mb-4 {
    margin-bottom: 1.5rem;
  }
  
  .mb-5 {
    margin-bottom: 2rem;
  }
  
  /* 全屏部分和滚动样式 */
  .section {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 80px 20px;
    overscroll-behavior: contain; /* 防止滚动传播 */
  }
  
  .section.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  /* 添加内容动画 */
  .section .container {
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0.05s;
  }
  
  .section.active .container {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* 为不同元素添加延迟动画 */
  .section .hero-content,
  .section .value-wrapper,
  .section .download-options {
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
  }
  
  .section.active .hero-content,
  .section.active .value-wrapper,
  .section.active .download-options {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* 为标题添加动画 */
  .section .section-title {
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
  }
  
  .section.active .section-title {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* 为副标题添加动画 */
  .section .section-subtitle {
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  }
  
  .section.active .section-subtitle {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* 为value-item添加动画 */
  .value-item {
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .section.active .value-item:nth-child(1) { transition-delay: 0.25s; }
  .section.active .value-item:nth-child(2) { transition-delay: 0.3s; }
  .section.active .value-item:nth-child(3) { transition-delay: 0.35s; }
  .section.active .value-item:nth-child(4) { transition-delay: 0.4s; }
  
  .section.active .value-item {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* 导航样式 */
  .header {
    background-color: rgba(255, 255, 255, 0.9);
    color: var(--dark-text);
    padding: 20px 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    height: 80px; /* 固定高度 */
  }
  
  .header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
  }
  
  /* 提示条样式 */
  .marquee-container {
    background-color: rgba(234, 62, 64, 0.1);
    width: 100%;
    padding: 10px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
  }
  
  .notice-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .notice-item {
    color: var(--light-text);
    margin: 0 15px;
    cursor: pointer;
    transition: color 0.3s;
    font-size: 14px;
    padding: 4px 12px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .notice-item:hover {
    color: var(--secondary-color);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .notice-separator {
    color: rgba(255, 255, 255, 0.3);
    margin: 0 10px;
  }
  
  /* 弹窗样式 */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: var(--card-bg);
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .modal-header h3 {
    margin: 0;
    color: var(--light-text);
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--light-text);
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal .beta-notice-box,
  .modal .security-notice-box {
    background-color: rgba(234, 62, 64, 0.05);
    border-left: 4px solid var(--secondary-color);
    padding: 15px;
    border-radius: 4px;
  }
  
  .modal a {
    color: var(--secondary-color);
    text-decoration: underline;
  }
  
  /* Logo 样式 */
  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .logo-link {
    display: block;
    text-decoration: none;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .nav-logo {
    width: 38px;
    height: 38px;
    object-fit: contain;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 3px;
    background-color: #fff;
  }
  
  .logo-text-container {
    position: relative;
    display: inline-block;
  }
  
  .logo-text {
    font-family: var(--title-font);
    font-weight: bold;
    font-size: 24px;
    letter-spacing: 0.5px;
    color: var(--dark-text);
    margin: 0;
    position: relative;
    transition: all 0.3s ease;
    text-transform: none;
  }
  
  .logo-text-highlight {
    font-family: var(--title-font);
    font-weight: bold;
    color: var(--secondary-color);
    position: relative;
    letter-spacing: 1px;
    transition: all 0.3s ease;
  }
  
  .logo-link:hover .logo-text-highlight {
    text-shadow: 0 0 10px rgba(234, 62, 64, 0.5);
  }
  
  /* 删除下滑线效果 */
  
  .logo-badge {
    position: absolute;
    top: -6px;
    right: -28px;
    font-size: 11px;
    color: var(--light-text);
    background-color: var(--secondary-color);
    padding: 2px 4px;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  
  .logo-link:hover .logo-badge {
    transform: scale(1.1);
  }
  
  .slogan {
    font-size: 14px;
    opacity: 0.9;
    margin-top: 5px;
  }
  
  /* 导航链接样式 */
  .navigation ul {
    display: flex;
    list-style: none;
  }
  
  .navigation li {
    margin-left: 30px;
  }
  
  .navigation a {
    color: var(--dark-text);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    padding: 5px 0;
    position: relative;
  }
  
  .navigation a::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: var(--secondary-color);
    transition: width 0.3s;
  }
  
  .navigation a:hover::after,
  .navigation a.active::after {
    width: 100%;
  }
  
  .navigation a:hover,
  .navigation a.active {
    color: var(--secondary-color);
  }
  
  .doc-link {
    color: var(--light-text) !important;
    font-weight: 500 !important;
  }
  
  .doc-link:hover {
    color: var(--secondary-color) !important;
    text-decoration: none;
  }
  
  /* 首页部分优化 */
  .hero-section {
    background: radial-gradient(circle at center, #f5f5f5 0%, #ffffff 70%);
    color: var(--dark-text);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 10% 20%, rgba(234, 62, 64, 0.05) 0%, transparent 25%),
      radial-gradient(circle at 85% 60%, rgba(234, 62, 64, 0.05) 0%, transparent 30%);
    z-index: -1;
    opacity: 0.7;
  }
  
  .hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 3;
  }
  
  .hero-title {
    font-family: var(--title-font);
    font-size: 50px;
    margin-bottom: 30px;
    font-weight: bold;
    color: var(--secondary-color);
    text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.15);
    position: relative;
    display: inline-block;
    letter-spacing: 1px;
    transform-origin: center;
    animation: bounceTitle 3s infinite alternate ease-in-out;
  }
  
  @keyframes bounceTitle {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02) rotate(0.5deg);
    }
  }
  
  .hero-description {
    font-family: var(--main-font);
    font-size: 24px;
    max-width: 650px;
    margin: 0 auto 50px;
    opacity: 0.9;
    line-height: 1.6;
    color: #333333;
    letter-spacing: 0.2px;
    position: relative;
    display: block; /* 确保是块级元素 */
    font-weight: 500;
  }
  
  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .app-store-btn, .android-btn {
    transition: all 0.3s ease;
    display: block;
  }
  
  .app-store-btn:hover, .android-btn:hover {
    transform: translateY(-5px);
    filter: none;
  }
  
  /* 添加active状态的样式，移除阴影 */
.app-store-btn:active, .android-btn:active {
  transform: translateY(-2px);
  filter: none;
}

/* 添加store-btn的active状态样式 */
.store-btn:active {
  box-shadow: none;
  transform: translateY(-1px) scale(1.01);
  background-color: rgba(255, 255, 255, 1);
}

/* 移除active状态下的特殊样式，因为hover已经处理了 */
  
  /* 修改按钮为矩形布局 */
  .store-btn {
    display: flex;
    align-items: center;
    border-radius: 16px;
    padding: 12px 24px;
    border: 2px solid #000000;
    color: #000000;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: none;
    transition: all 0.3s ease;
  }
  
  .store-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: none;
  background-color: rgba(255, 255, 255, 0.95);
  border-color: var(--secondary-color);
}

.store-btn img {
  width: 28px;
  height: 28px;
  margin-right: 15px;
}

/* 添加悬停效果 */
.store-btn:hover img {
  filter: invert(23%) sepia(90%) saturate(7000%) hue-rotate(355deg) brightness(95%) contrast(85%);
}

.store-btn:hover span {
  color: var(--secondary-color);
}
  
  .store-btn span {
  font-family: var(--main-font);
  font-size: 18px;
  font-weight: 500;
  transition: color 0.3s ease;
}
  
  /* 无阴影按钮 */
  .primary-noshadow {
    background-color: var(--secondary-color);
    color: var(--light-text);
    box-shadow: none;
    border: none;
    position: relative;
    overflow: hidden;
  }
  
  .primary-noshadow:hover {
    /* Change hover background color to a lighter red */
    background-color: #F05456;
    transform: translateY(-3px);
    box-shadow: none;
  }
  
  .primary-noshadow::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s;
  }
  
  .primary-noshadow:hover::before {
    left: 100%;
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 36px;
    }
    
    .hero-description {
      font-size: 18px;
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .app-store-btn svg, .android-btn svg {
      width: 140px;
      height: 42px;
    }
  }
  
  /* 简介部分优化 */
  .value-section {
    background: radial-gradient(circle at center, #f5f5f5 0%, #ffffff 70%);
    color: var(--dark-text);
    position: relative;
    overflow: hidden;
  }
  
  .section-bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 90% 10%, rgba(234, 62, 64, 0.07) 0%, transparent 35%),
      radial-gradient(circle at 10% 90%, rgba(234, 62, 64, 0.05) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(234, 62, 64, 0.03) 0%, transparent 60%);
    z-index: 0;
    opacity: 0.8;
  }
  
  .section-title {
    font-family: var(--title-font);
    font-size: 42px;
    background: linear-gradient(to right, #333, #EA3E40);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 15px;
    position: relative;
    z-index: 1;
    letter-spacing: 0.5px;
    font-weight: bold;
  }
  
  .section-subtitle {
    font-family: var(--main-font);
    font-size: 20px;
    color: #333333;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 1;
    line-height: 1.5;
    letter-spacing: 0.2px;
    font-weight: 500;
  }
  
  .value-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
    width: 100%;
    position: relative;
    z-index: 1;
  }
  
  .value-item {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    padding: 35px 30px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    z-index: 1;
    border: 1px solid rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  
  .value-item:before {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(234, 62, 64, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    top: -50%;
    left: -50%;
    z-index: -1;
    transform: scale(0);
    transition: transform 0.5s ease-out;
    border-radius: 50%;
  }
  
  .value-item:hover:before {
    transform: scale(1);
  }
  
  .value-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
    border-color: rgba(234, 62, 64, 0.3);
  }
  
  .value-item h3 {
    font-family: var(--title-font);
    font-size: 24px;
    margin-bottom: 15px;
    color: var(--dark-text);
    position: relative;
    display: inline-block;
    font-weight: bold;
    letter-spacing: 0.2px;
  }
  
  .value-item h3:after {
    content: "";
    position: absolute;
    width: 40px;
    height: 2px;
    background-color: var(--secondary-color);
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
  
  .value-item:hover h3:after {
    width: 60px;
  }
  
  .value-icon-container {
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease;
  }
  
  .value-item:hover .value-icon-container {
    transform: scale(1.1);
  }
  
  .value-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    filter: drop-shadow(0 4px 6px rgba(234, 62, 64, 0.2));
    transition: filter 0.3s ease, transform 0.3s ease;
    display: flex;
    justify-content: center;
  }
  
  .value-item:hover .value-icon {
    filter: drop-shadow(0 8px 16px rgba(234, 62, 64, 0.4));
  }
  
  .value-item p {
    font-family: var(--main-font);
    color: #333333;
    line-height: 1.7;
    font-size: 16px;
    letter-spacing: 0.1px;
  }
  
  /* 下载部分优化 */
  .download-section {
    background: radial-gradient(circle at center, #f5f5f5 0%, #ffffff 70%);
    color: var(--dark-text);
    position: relative;
    overflow: hidden;
  }
  
  .download-bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at 0% 0%, rgba(234, 62, 64, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 100% 100%, rgba(234, 62, 64, 0.08) 0%, transparent 50%);
    z-index: 0;
    opacity: 0.7;
  }
  
  .download-options {
    display: flex;
    justify-content: center;
    gap: 50px;
    flex-wrap: wrap;
    margin-top: 20px;
    position: relative;
    z-index: 1;
  }
  
  .download-card {
    background-color: rgba(255, 255, 255, 0.8);
    text-align: center;
    width: 450px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border-radius: 20px;
    padding: 40px 30px;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    position: relative;
    z-index: 1;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  .download-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
    border-color: rgba(234, 62, 64, 0.35);
  }
  
  .download-icon {
    margin-bottom: 25px;
    opacity: 0.9;
    transition: transform 0.3s ease, opacity 0.3s ease;
    display: flex;
    justify-content: center;
  }
  
  .download-card:hover .download-icon {
    transform: scale(1.1);
    opacity: 1;
  }
  
  .download-card h3 {
    font-family: var(--title-font);
    font-size: 28px;
    color: var(--dark-text);
    font-weight: bold;
    margin-bottom: 20px;
    letter-spacing: 0.2px;
  }
  
  .download-card p {
    font-family: var(--main-font);
    color: #333333;
    font-size: 16px;
    margin-bottom: 30px;
    letter-spacing: 0.1px;
  }
  
  .download-with-select {
    padding-right: 15px;
    position: relative;
    text-align: left;
    min-width: 270px;
  }
  
  .chip-select-wrapper {
    display: inline-block;
    color: var(--light-text);
    position: relative;
    z-index: 1;
    margin-left: 5px;
  }
  
  .inline-select-btn {
    border: none;
    background: transparent;
    font-size: inherit;
    font-family: inherit;
    color: var(--light-text);
    font-weight: inherit;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0 0 0 0;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right center;
  }
  
  .download-info {
    margin-top: 50px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    position: relative;
    z-index: 1;
  }
  
  .text-link {
    color: var(--secondary-color);
    text-decoration: underline;
    transition: all 0.3s ease;
    opacity: 0.9;
  }
  
  .text-link:hover {
    opacity: 1;
    color: #4a7df2;
    text-shadow: 0 0 8px rgba(74, 125, 242, 0.4);
    text-decoration: none;
  }
  
  @media (max-width: 768px) {
    .section-title {
      font-size: 32px;
    }
    
    .section-subtitle {
      font-size: 18px;
    }
    
    .download-card {
      min-width: 280px;
      padding: 30px 20px;
    }
    
    .download-card h3 {
      font-size: 24px;
    }
    
    .download-options {
      gap: 30px;
    }
    
    .value-item {
      padding: 25px 20px;
    }
    
    .value-icon {
      width: 60px;
      height: 60px;
    }
  }
  
  /* 页脚样式 */
  .footer {
    background-color: var(--primary-color);
    color: rgba(0, 0, 0, 0.7);
    padding: 20px 0;
    width: 100%;
    z-index: 90;
  }
  
  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .copyright {
    margin: 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    font-family: var(--main-font);
  }
  
  .footer-links {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--main-font);
  }
  
  .footer-link {
    color: rgba(0, 0, 0, 0.6);
    text-decoration: none;
    transition: color 0.3s ease;
    font-family: var(--main-font);
  }
  
  .footer-link:hover {
    color: var(--secondary-color);
    text-decoration: underline;
  }
  
  .footer-separator {
    margin: 0 10px;
    color: rgba(0, 0, 0, 0.4);
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .section {
      padding-top: 140px;
    }
    
    .header .container {
      flex-direction: column;
      text-align: center;
    }
    
    .navigation ul {
      margin-top: 20px;
      justify-content: center;
    }
    
    .navigation li {
      margin: 0 15px;
    }
    
    .notice-content {
      flex-direction: column;
      gap: 8px;
    }
    
    .notice-item {
      width: 90%;
      margin: 0 auto;
    }
    
    .notice-separator {
      display: none;
    }
    
    .hero-content h2 {
      font-size: 32px;
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: 15px;
      justify-content: center;
    }
    
    .footer-links {
      gap: 10px;
    }
    
    .value-icon {
      width: 60px;
      height: 60px;
    }
    
    .section-indicators {
      right: 15px;
    }
    
    .indicator-dot {
      width: 8px;
      height: 8px;
    }
  }
  
  /* 指示点样式 */
  .section-indicators {
    display: none;
  }
  
  /* Element Plus 轮播图样式覆盖 */
  .main-swiper {
    width: 100%;
    height: calc(100vh - 80px);
    margin-top: 80px;
    overflow: hidden;
    touch-action: none; /* 禁止浏览器默认的触摸行为 */
  }
  
  .el-carousel__container {
    height: 100%;
  }
  
  .el-carousel__item {
    height: 100%;
    overflow-y: auto; 
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    touch-action: pan-x pinch-zoom; /* 只允许水平滑动 */
  }
  
  /* 禁止内部元素的滚动行为触发页面切换 */
  .section {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 80px 20px;
    overscroll-behavior: contain; /* 防止滚动传播 */
  }
  
  /* 添加切换动画效果，让页面切换更平滑 */
  .el-carousel__item.is-active {
    transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  }
  
  /* 自定义指示器样式 */
  .custom-indicators {
    position: fixed;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 100;
  }
  
  .indicator-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .indicator-dot:hover {
    background-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.2);
  }
  
  .indicator-dot.active {
    background-color: var(--secondary-color);
    transform: scale(1.2);
    box-shadow: 0 0 10px rgba(234, 62, 64, 0.5);
  }
  
  /* 修复 section 样式问题 */
  .section {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 80px 20px;
  }
  
  /* 修复动画和内容显示 */
  .section .container,
  .section .hero-content,
  .section .value-wrapper,
  .section .download-options,
  .section .section-title,
  .section .section-subtitle,
  .value-item {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  
  /* 修复第二第三页内容不能正常显示的问题 */
  .value-wrapper, 
  .download-options {
    width: 100%;
    max-width: 1200px;
    padding: 0 20px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    .custom-indicators {
      right: 15px;
    }
    
    .indicator-dot {
      width: 8px;
      height: 8px;
    }
  }
  
  /* 增加滑动提示样式 */
  .slide-hint {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.7;
    animation: fadeInOut 2s infinite;
  }
  
  .slide-hint-arrow {
    margin-top: 5px;
    width: 20px;
    height: 20px;
    border-left: 2px solid rgba(255, 255, 255, 0.5);
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);
    transform: rotate(-45deg);
  }
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }
  
  /* 删除原有的金融动画背景元素 */
  .finance-bg-animation,
  .stock-graph,
  .stock-dots,
  .stock-line,
  .line1, .line2, .line3,
  .stock-candle,
  .candle1, .candle2, .candle3, .candle4,
  .data-circle,
  .circle1, .circle2, .circle3,
  .data-flow,
  .flow1, .flow2, .flow3,
  .data-grid,
  .market-pulse,
  .pulse1, .pulse2, .pulse3,
  .market-chart,
  .market-symbols {
    display: none;
  }
  
  /* 添加烹饪主题动画背景 - 已隐藏 */
  .cooking-bg-animation {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    opacity: 0.3;
  }
  
  /* 厨具元素样式 - 使用提供的SVG图标 */
  .kitchen-utensil {
    position: absolute;
    opacity: 0.35;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    filter: drop-shadow(0 0 5px rgba(234, 62, 64, 0.2)) invert(30%) sepia(20%) saturate(800%) hue-rotate(325deg) brightness(95%);
    animation: floatUtensil 20s infinite ease-in-out;
    /* 限制在水平方向中间70%区域 */
    left: calc(15% + var(--utensil-left-offset, 0%));
    transform: scale(0.7);
  }
  
  /* 使用提供的SVG图标 - 避开中央区域 */
  .bg01 {
    width: 60px;
    height: 60px;
    top: 12%; 
    --utensil-left-offset: 5%;
    background-image: url("/images/bg01.svg");
    animation: floatUtensil 20s infinite ease-in-out;
  }
  
  .bg02 {
    width: 55px;
    height: 55px;
    bottom: 12%;
    --utensil-left-offset: 10%;
    background-image: url("/images/bg02.svg");
    animation: floatUtensil 20s infinite ease-in-out 2s;
  }
  
  .bg03 {
    width: 50px;
    height: 50px;
    top: 18%;
    --utensil-left-offset: 60%;
    background-image: url("/images/bg03.svg");
    animation: floatUtensil 20s infinite ease-in-out 1s;
  }
  
  .bg04 {
    width: 65px;
    height: 65px;
    bottom: 18%;
    --utensil-left-offset: 65%;
    background-image: url("/images/bg04.svg");
    animation: floatUtensil 20s infinite ease-in-out 5s;
  }
  
  .bg05 {
    width: 45px;
    height: 45px;
    top: 75%;
    --utensil-left-offset: 25%;
    background-image: url("/images/bg05.svg");
    animation: floatUtensil 20s infinite ease-in-out 3s;
  }
  
  .bg06 {
    width: 55px;
    height: 55px;
    top: 8%;
    --utensil-left-offset: 35%;
    background-image: url("/images/bg06.svg");
    animation: floatUtensil 20s infinite ease-in-out 7s;
  }
  
  /* 修改原有的浮动动画，减少浮动距离，降低颜色变化幅度 */
  @keyframes floatUtensil {
    0%, 100% { 
      transform: translateY(0) rotate(0deg) scale(0.7);
      filter: drop-shadow(0 0 5px rgba(234, 62, 64, 0.2)) invert(30%) sepia(20%) saturate(800%) hue-rotate(325deg) brightness(95%);
    }
    50% { 
      transform: translateY(-8px) rotate(2deg) scale(0.7);
      filter: drop-shadow(0 0 8px rgba(234, 62, 64, 0.3)) invert(30%) sepia(20%) saturate(900%) hue-rotate(325deg) brightness(100%);
    }
  }
  
  /* 删除不需要的类名 */
  .knife, .fork, .cleaver, .pot, .chopsticks, .bottle {
    display: none;
  }
  
  /* 删除不需要的动画 */
  .unused-animations {
    display: none;
  }
  
  /* 标题渐变滚动效果 - 更明亮活泼 */
  .gradient-text {
    font-family: var(--title-font);
    background-image: linear-gradient(
      to right,
      #FF6B6C,
      #EA3E40,
      #FF4438,
      #EA3E40,
      #FF6B6C
    );
    background-size: 300% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: textGradientScroll 6s linear infinite;
    text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
    font-weight: bold;
    letter-spacing: 1px;
    font-size: 3.2rem;
  }
  
  /* 删除阴影伪元素 */
  .gradient-text::before {
    content: none;
  }
  
  @keyframes textGradientScroll {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 300% center;
    }
  }
  
  /* 调整动画相关样式 */
  .gsap-title, .gsap-desc, .gsap-buttons {
    will-change: transform, opacity;
    opacity: 0; /* 预先设置为不可见，避免闪烁 */
  }
  
  /* 添加初始状态样式，防止加载时闪烁 */
  .gsap-title {
    transform: translateY(-50px) scale(0.9);
  }
  
  .gsap-desc {
    transform: translateX(-30px);
    visibility: hidden;
  }
  
  .gsap-buttons {
    transform: translateY(30px);
  }
  
  .hero-content {
    overflow: hidden;
  }
  
  /* 大型背景图和动画效果 */
  .animated-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }
  
  /* 基础渐变背景 */
  .bg-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      #ffffff 0%, 
      #f8f8f8 30%, 
      #f5f5f5 50%, 
      #f0f0f0 70%, 
      #f9f9f9 100%);
    animation: gradientShift 15s ease infinite;
  }
  
  /* 点状图案背景 */
  .bg-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(rgba(234, 62, 64, 0.08) 1px, transparent 1px),
      radial-gradient(rgba(234, 62, 64, 0.05) 2px, transparent 2px);
    background-size: 30px 30px, 50px 50px;
    background-position: 0 0, 15px 15px;
    opacity: 0.5;
    animation: patternFloat 60s linear infinite;
  }
  
  /* 添加厨具轮廓作为背景元素 */
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.35;
    animation: shapeFloat 25s ease-in-out infinite;
  }
  
  .shape1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(234, 62, 64, 0.2) 0%, rgba(234, 62, 64, 0.05) 50%, rgba(234, 62, 64, 0) 70%);
    top: -150px;
    left: -100px;
    animation-delay: 0s;
  }
  
  .shape2 {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(255, 186, 90, 0.2) 0%, rgba(255, 186, 90, 0.05) 50%, rgba(255, 186, 90, 0) 70%);
    bottom: -200px;
    right: -150px;
    animation-delay: 5s;
  }
  
  .shape3 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 70%);
    top: 40%;
    right: 15%;
    animation-delay: 2s;
  }
  
  /* 添加烹饪主题动画背景 - 已隐藏 */
  .cooking-bg-animation {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    opacity: 0.3;
  }
  
  /* 厨具元素样式 - 使用提供的SVG图标 */
  .kitchen-utensil {
    position: absolute;
    opacity: 0.35;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    filter: drop-shadow(0 0 5px rgba(234, 62, 64, 0.2)) invert(30%) sepia(20%) saturate(800%) hue-rotate(325deg) brightness(95%);
    animation: floatUtensil 20s infinite ease-in-out;
    /* 限制在水平方向中间70%区域 */
    left: calc(15% + var(--utensil-left-offset, 0%));
    transform: scale(0.7);
  }
  
  /* 使用提供的SVG图标 - 避开中央区域 */
  .bg01 {
    width: 60px;
    height: 60px;
    top: 12%; 
    --utensil-left-offset: 5%;
    background-image: url("/images/bg01.svg");
    animation: floatUtensil 20s infinite ease-in-out;
  }
  
  .bg02 {
    width: 55px;
    height: 55px;
    bottom: 12%;
    --utensil-left-offset: 10%;
    background-image: url("/images/bg02.svg");
    animation: floatUtensil 20s infinite ease-in-out 2s;
  }
  
  .bg03 {
    width: 50px;
    height: 50px;
    top: 18%;
    --utensil-left-offset: 60%;
    background-image: url("/images/bg03.svg");
    animation: floatUtensil 20s infinite ease-in-out 1s;
  }
  
  .bg04 {
    width: 65px;
    height: 65px;
    bottom: 18%;
    --utensil-left-offset: 65%;
    background-image: url("/images/bg04.svg");
    animation: floatUtensil 20s infinite ease-in-out 5s;
  }
  
  .bg05 {
    width: 45px;
    height: 45px;
    top: 75%;
    --utensil-left-offset: 25%;
    background-image: url("/images/bg05.svg");
    animation: floatUtensil 20s infinite ease-in-out 3s;
  }
  
  .bg06 {
    width: 55px;
    height: 55px;
    top: 8%;
    --utensil-left-offset: 35%;
    background-image: url("/images/bg06.svg");
    animation: floatUtensil 20s infinite ease-in-out 7s;
  }
  
  /* 修改原有的浮动动画，减少浮动距离，降低颜色变化幅度 */
  @keyframes floatUtensil {
    0%, 100% { 
      transform: translateY(0) rotate(0deg) scale(0.7);
      filter: drop-shadow(0 0 5px rgba(234, 62, 64, 0.2)) invert(30%) sepia(20%) saturate(800%) hue-rotate(325deg) brightness(95%);
    }
    50% { 
      transform: translateY(-8px) rotate(2deg) scale(0.7);
      filter: drop-shadow(0 0 8px rgba(234, 62, 64, 0.3)) invert(30%) sepia(20%) saturate(900%) hue-rotate(325deg) brightness(100%);
    }
  }
  
  /* 删除不需要的类名 */
  .knife, .fork, .cleaver, .pot, .chopsticks, .bottle {
    display: none;
  }
  
  /* 删除不需要的动画 */
  .unused-animations {
    display: none;
  }
  
  /* 标题渐变滚动效果 - 更明亮活泼 */
  .gradient-text {
    font-family: var(--title-font);
    background-image: linear-gradient(
      to right,
      #FF6B6C,
      #EA3E40,
      #FF4438,
      #EA3E40,
      #FF6B6C
    );
    background-size: 300% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: textGradientScroll 6s linear infinite;
    text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
    font-weight: bold;
    letter-spacing: 1px;
    font-size: 3.2rem;
  }
  
  /* 删除阴影伪元素 */
  .gradient-text::before {
    content: none;
  }
  
  @keyframes textGradientScroll {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 300% center;
    }
  }
  
  /* 调整动画相关样式 */
  .gsap-title, .gsap-desc, .gsap-buttons {
    will-change: transform, opacity;
  }
  
  .hero-content {
    overflow: hidden;
  }
  
  /* 大型背景图和动画效果 */
  .animated-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }
  
  /* 基础渐变背景 */
  .bg-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      #ffffff 0%, 
      #f8f8f8 30%, 
      #f5f5f5 50%, 
      #f0f0f0 70%, 
      #f9f9f9 100%);
    animation: gradientShift 15s ease infinite;
  }
  
  /* 点状图案背景 */
  .bg-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(rgba(234, 62, 64, 0.08) 1px, transparent 1px),
      radial-gradient(rgba(234, 62, 64, 0.05) 2px, transparent 2px);
    background-size: 30px 30px, 50px 50px;
    background-position: 0 0, 15px 15px;
    opacity: 0.5;
    animation: patternFloat 60s linear infinite;
  }
  
  /* 添加厨具图标背景元素 */
  .bg-kitchen-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
    opacity: 0.08;
  }
  
  .kitchen-element {
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.4;
    filter: grayscale(20%) opacity(70%);
  }
  
  .element1 {
    width: 500px;
    height: 500px;
    background-image: url('/images/bg01.svg');
    top: 10%;
    left: 5%;
    transform: rotate(-15deg) scale(2);
    opacity: 0.06;
    animation: floatElement 30s infinite ease-in-out;
  }
  
  .element2 {
    width: 600px;
    height: 600px;
    background-image: url('/images/bg03.svg');
    bottom: 5%;
    right: 5%;
    transform: rotate(15deg) scale(2.2);
    opacity: 0.05;
    animation: floatElement 30s infinite ease-in-out 5s;
  }
  
  /* 轻微光效背景 */
  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 0%, 
      rgba(255, 255, 255, 0.5) 0%, 
      rgba(255, 255, 255, 0.3) 20%, 
      rgba(255, 255, 255, 0) 60%);
    z-index: 2;
    opacity: 0.7;
    pointer-events: none;
  }
  
  /* 细微网格线 */
  .hero-section::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: 1;
    opacity: 0.3;
    pointer-events: none;
  }
  
  /* 背景动画 */
  @keyframes gradientShift {
    0%, 100% {
      opacity: 0.85;
    }
    50% {
      opacity: 1;
    }
  }
  
  @keyframes patternFloat {
    0% {
      background-position: 0 0, 15px 15px;
    }
    100% {
      background-position: 100px 100px, 115px 115px;
    }
  }
  
  /* 动画定义 */
  @keyframes shapeFloat {
    0%, 100% {
      transform: translateY(0) scale(1);
      opacity: 0.35;
    }
    50% {
      transform: translateY(-30px) scale(1.05);
      opacity: 0.45;
    }
  }
  
  @keyframes floatElement {
    0%, 100% {
      transform: rotate(-15deg) scale(2) translateY(0);
    }
    50% {
      transform: rotate(-12deg) scale(2.05) translateY(-10px);
    }
  }
  
  /* 打字效果样式 */
  .typing-effect {
    display: block; /* 确保是块级元素 */
    min-height: 40px; /* 设置最小高度，保持占位 */
    line-height: 1.6;
    margin-bottom: 50px; /* 保持与原来相同的间距 */
    position: relative;
    visibility: hidden; /* 初始状态为隐藏 */
  }
  
  /* 光标已被完全隐藏 */
  /* 以下内容被注释掉以移除光标
  .typing-effect.typing-active::after {
    content: "|";
    animation: blink 0.7s infinite;
    font-weight: normal;
  }
  */
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  /* 页面加载遮罩 */
  .page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transition: opacity 0.3s;
  }
  
  .loader-content {
    text-align: center;
  }
  
  .loader-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(234, 62, 64, 0.2);
    border-radius: 50%;
    border-top-color: var(--secondary-color);
    animation: spin 0.8s linear infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  