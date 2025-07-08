<template>
    <div class="legal-page container">
      <!-- Remove the back link -->
      <!-- <NuxtLink to="/" class="back-link">&larr; 返回首页</NuxtLink> -->
      <p>最后更新日期：{{ new Date().toLocaleDateString('zh-CN') }}</p>

      <section>
        <h2>1. 接受条款</h2>
        <p>访问或使用一键大厨（"本服务"），即表示您同意受本使用条款（"条款"）的约束。如果您不同意这些条款的任何部分，则不得访问本服务。</p>
      </section>

      <section>
        <h2>2. 服务描述</h2>
        <p>一键大厨是一款智能烹饪辅助应用，提供以下功能：</p>
        <ul>
          <li>AI隔空手势识别技术，帮助用户在烹饪过程中免接触操作设备；</li>
          <li>视频导入功能，可将烹饪教学视频转换为图文教程；</li>
          <li>智能菜谱推荐和烹饪指导服务。</li>
        </ul>
        <p>本服务仅供参考和辅助使用，在使用过程中您应始终保证人身安全和厨房安全。您应对自己的烹饪过程中的所有安全问题承担全部责任。</p>
      </section>

      <section>
        <h2>3. 用户行为与内容使用</h2>
        <p>在使用本服务时，您同意：</p>
        <ul>
          <li>不将本服务用于任何非法或未经授权的目的；</li>
          <li>遵守所有适用的法律法规；</li>
          <li>仅上传您拥有合法权利的视频内容或已获得适当授权的内容；</li>
          <li>不上传包含版权保护内容、侵犯他人知识产权或违反法律法规的视频；</li>
          <li>对您上传的所有内容承担完全责任，包括但不限于版权、肖像权等法律责任；</li>
          <li>理解并接受AI技术可能存在的识别误差，不完全依赖手势识别功能进行危险操作。</li>
        </ul>
      </section>

      <section>
        <h2>4. 知识产权与内容处理</h2>
        <p>关于视频导入和内容生成功能：</p>
        <ul>
          <li>您保证上传的视频内容不侵犯任何第三方的知识产权；</li>
          <li>对于生成的图文教程，您理解这是基于您提供内容的AI处理结果；</li>
          <li>我们不对用户上传内容的合法性进行审查，用户应自行承担相关法律责任；</li>
          <li>如发现侵权内容，我们有权立即删除相关内容并暂停相关功能。</li>
        </ul>
      </section>

      <section>
        <h2>5. 免责声明</h2>
        <p>本服务按"原样"和"可用"的基础提供。一键大厨不作任何明示或暗示的保证，包括但不限于：</p>
        <ul>
          <li>适销性、特定用途适用性和不侵权的保证；</li>
          <li>AI手势识别的准确性和可靠性；</li>
          <li>视频转换功能的完整性和准确性；</li>
          <li>烹饪过程中的安全性和食品安全。</li>
        </ul>
      </section>

      <section>
        <h2>6. 责任限制</h2>
        <p>在任何情况下，一键大厨均不对以下情况承担责任：</p>
        <ul>
          <li>因使用或无法使用本服务而导致的任何间接、附带、特殊、后果性或惩罚性损害；</li>
          <li>因AI手势识别误操作导致的任何损失或伤害；</li>
          <li>因用户上传侵权内容而产生的法律纠纷；</li>
          <li>因烹饪过程中的意外事故或食品安全问题；</li>
          <li>因第三方内容或服务导致的任何损失。</li>
        </ul>
      </section>

      <section>
        <h2>7. 安全提醒</h2>
        <p>使用本服务时，请特别注意：</p>
        <ul>
          <li>在使用手势识别功能时，确保周围环境安全，避免在操作危险设备时完全依赖手势控制；</li>
          <li>烹饪过程中始终保持注意力集中，不要完全依赖应用指导；</li>
          <li>对食材过敏或有特殊饮食要求的用户，请在烹饪前仔细检查食材成分；</li>
          <li>使用厨房设备时遵循设备安全操作规范。</li>
        </ul>
      </section>

      <section>
        <h2>8. 条款变更</h2>
        <p>我们保留随时修改这些条款的权利。我们将通过在本服务上发布新条款来通知您任何更改。建议您定期查看这些条款。更改发布后继续使用本服务即表示您接受这些更改。</p>
      </section>

      <section>
        <h2>9. 联系我们</h2>
        <p>如果您对这些条款有任何疑问，请联系我们。</p>
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
    color: var(--secondary-color, #EA3E40);
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

  /* Back link styles removed */

  section {
    margin-bottom: 20px;
  }
  </style>