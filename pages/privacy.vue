<template>
    <div class="legal-page container">
      <!-- Remove the back link -->
      <!-- <NuxtLink to="/" class="back-link">&larr; 返回首页</NuxtLink> -->
      <p>最后更新日期：{{ new Date().toLocaleDateString('zh-CN') }}</p>
  
      <section>
        <h2>1. 我们收集的信息</h2>
        <p>在使用一键大厨服务时，我们可能会收集以下类型的信息：</p>
        <ul>
          <li><strong>基本信息：</strong>您的电子邮件地址、用户名等注册信息（如适用）；</li>
          <li><strong>使用数据：</strong>应用使用情况、功能偏好、错误日志等匿名统计信息；</li>
          <li><strong>设备信息：</strong>设备型号、操作系统版本、应用版本等技术信息；</li>
          <li><strong>手势数据：</strong>为提供AI手势识别功能，我们可能处理您的手势动作数据，但这些数据主要在本地设备处理；</li>
          <li><strong>视频内容：</strong>您上传用于转换的烹饪视频内容（仅在您主动上传时）。</li>
        </ul>
        <p>一键大厨应用的核心功能主要在本地设备运行，大部分个人数据不会发送到我们的服务器。</p>
      </section>
  
      <section>
        <h2>2. 信息的使用</h2>
        <p>我们收集的信息主要用于：</p>
        <ul>
          <li>提供、维护和改进本服务，包括AI手势识别和视频转换功能；</li>
          <li>个性化用户体验，提供更精准的菜谱推荐；</li>
          <li>与您沟通，例如回复您的查询或发送服务更新；</li>
          <li>分析使用情况以了解用户如何与本服务互动；</li>
          <li>改进AI算法的准确性和响应速度；</li>
          <li>确保服务安全，防止滥用和技术故障。</li>
        </ul>
      </section>
  
      <section>
        <h2>3. 信息共享</h2>
        <p>我们不会将您的个人信息出售或出租给第三方。我们仅在以下情况下共享信息：</p>
        <ul>
          <li>遵守法律义务或响应合法的政府要求；</li>
          <li>保护一键大厨的权利或财产；</li>
          <li>防止或调查与服务相关的可能的不当行为；</li>
          <li>保护服务用户或公众的人身安全；</li>
          <li>与可信的第三方服务提供商共享必要信息以提供技术支持（如云存储、数据分析服务），这些第三方受到严格的保密协议约束。</li>
        </ul>
      </section>
  
      <section>
        <h2>4. 数据安全</h2>
        <p>我们采取多层次的安全措施保护您的信息：</p>
        <ul>
          <li>使用行业标准的加密技术保护数据传输和存储；</li>
          <li>实施严格的访问控制，限制员工对用户数据的访问；</li>
          <li>定期进行安全审计和漏洞评估；</li>
          <li>对于手势识别功能，大部分处理在本地设备完成，减少数据传输风险。</li>
        </ul>
        <p>但是，没有任何通过互联网传输或电子存储的方法是100%安全的。由于一键大厨的核心功能主要在本地运行，您的大部分个人数据保留在您自己的设备上，这大大增强了数据安全性。</p>
      </section>
      
      <section>
          <h2>5. 视频内容处理</h2>
          <p>关于您上传的视频内容，我们承诺：</p>
          <ul>
            <li>仅在您明确授权的情况下处理您上传的视频内容；</li>
            <li>视频处理主要用于生成图文教程，不会用于其他商业目的；</li>
            <li>处理完成后，原始视频文件将根据您的设置进行保留或删除；</li>
            <li>我们不会将您的视频内容分享给第三方，除非获得您的明确同意；</li>
            <li>您可以随时要求删除已上传的视频内容。</li>
          </ul>
      </section>

      <section>
          <h2>6. 第三方服务</h2>
          <p>本服务可能集成或包含指向第三方服务的功能：</p>
          <ul>
            <li>AI处理服务提供商（用于手势识别和视频分析）；</li>
            <li>云存储服务（用于数据备份和同步）；</li>
            <li>分析服务（用于改进用户体验）。</li>
          </ul>
          <p>我们强烈建议您查看这些第三方服务的隐私政策。我们无法控制任何第三方网站或服务的内容、隐私政策或做法，也不承担任何责任。</p>
      </section>
  
      <section>
        <h2>7. 您的权利</h2>
        <p>根据适用的数据保护法律，您享有以下权利：</p>
        <ul>
          <li><strong>访问权：</strong>您有权了解我们收集了您的哪些个人信息；</li>
          <li><strong>更正权：</strong>您有权要求更正不准确的个人信息；</li>
          <li><strong>删除权：</strong>您有权要求删除您的个人信息；</li>
          <li><strong>限制处理权：</strong>在某些情况下，您有权限制我们处理您的个人信息；</li>
          <li><strong>数据可携权：</strong>您有权以结构化、常用和机器可读的格式获取您的个人信息。</li>
        </ul>
        <p>如需行使这些权利，请通过下方联系方式与我们联系。</p>
      </section>

      <section>
        <h2>8. 政策变更</h2>
        <p>我们可能会不时更新我们的隐私政策。重大变更时，我们将通过以下方式通知您：</p>
        <ul>
          <li>在此页面上发布新的隐私政策；</li>
          <li>通过应用内通知告知您；</li>
          <li>如有必要，通过电子邮件通知您。</li>
        </ul>
        <p>建议您定期查看本隐私政策以了解任何更改。</p>
      </section>

      <section>
        <h2>9. 联系我们</h2>
        <p>如果您对本隐私政策有任何疑问、意见或需要行使您的权利，请通过以下方式联系我们：</p>
        <ul>
          <li>应用内反馈功能；</li>
          <li>发送邮件至我们的客服邮箱；</li>
          <li>通过官方网站的联系表单。</li>
        </ul>
        <p>我们将在收到您的请求后尽快回复，通常不超过30天。</p>
      </section>
    </div>
  </template>
  
  <script setup>
  // 可以添加任何需要的逻辑
  </script>
  
  <style scoped>
  .legal-page {
    padding: 40px 20px;
    max-width: 800px;
    margin: 40px auto; 
    background-color: #fff;
    color: #333333; /* Dark text for light bg */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .legal-page h1 {
    text-align: center;
    margin-bottom: 30px;
    color: var(--secondary-color, #2B5DE0); /* Keep title color */
  }
  
  .legal-page h2 {
    margin-top: 30px;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 5px;
    color: #333333;
  }
  
  .legal-page p, .legal-page li {
    line-height: 1.7;
    margin-bottom: 15px;
    color: #333333;
  }

  .legal-page strong {
    color: #333333; /* Dark text for light bg */
    font-weight: 600;
  }
  
  .legal-page ul {
      list-style: disc;
      padding-left: 20px;
      margin-bottom: 15px;
  }
  
  /* Remove back link styles as link is removed */
  /*
  .back-link { ... }
  .back-link:hover { ... }
  */
  
  section {
    margin-bottom: 20px;
  }
  </style>