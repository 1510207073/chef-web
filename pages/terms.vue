<template>
    <div class="legal-page container">
      <!-- Remove the back link -->
      <!-- <NuxtLink to="/" class="back-link">&larr; 返回首页</NuxtLink> -->
      <h1>使用条款</h1>
      <p>最后更新日期：{{ new Date().toLocaleDateString('zh-CN') }}</p>

      <section>
        <h2>1. 接受条款</h2>
        <p>访问或使用一键大厨（"本服务"），即表示您同意受本使用条款（"条款"）的约束。如果您不同意这些条款的任何部分，则不得访问本服务。</p>
      </section>

      <section>
        <h2>2. 服务描述</h2>
        <p>一键大厨提供智能烹饪辅助。本服务仅供参考，在使用过程中应保证人身安全和厨房安全。您应对自己的烹饪过程中的安全问题承担全部责任。</p>
      </section>

      <section>
        <h2>3. 用户行为</h2>
        <p>您同意不将本服务用于任何非法或未经授权的目的。您同意遵守所有适用的法律法规。</p>
      </section>

      <section>
        <h2>4. 免责声明</h2>
        <p>本服务按"原样"和"可用"的基础提供。一键大厨不作任何明示或暗示的保证，包括但不限于适销性、特定用途适用性和不侵权的保证。</p>
      </section>

      <section>
        <h2>5. 责任限制</h2>
        <p>在任何情况下，一键大厨均不对因使用或无法使用本服务而导致的任何间接、附带、特殊、后果性或惩罚性损害承担责任。</p>
      </section>

      <section>
        <h2>6. 条款变更</h2>
        <p>我们保留随时修改这些条款的权利。我们将通过在本服务上发布新条款来通知您任何更改。建议您定期查看这些条款。更改发布后继续使用本服务即表示您接受这些更改。</p>
      </section>

      <section>
        <h2>7. 联系我们</h2>
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
    color: #333333;
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

  .legal-page p {
    line-height: 1.7;
    margin-bottom: 15px;
    color: #333333;
  }

  /* Back link styles removed */

  section {
    margin-bottom: 20px;
  }
  </style>