# 开发和测试改进建议

## 1. 单元测试配置

```bash
# 安装测试依赖
pnpm add -D vitest @vue/test-utils happy-dom @nuxt/test-utils
```

```javascript
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

## 2. E2E 测试配置

```bash
# 安装 Playwright
pnpm add -D @playwright/test
```

```javascript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
})
```

## 3. 代码质量工具

```json
// .eslintrc.js
{
  "extends": [
    "@nuxt/eslint-config",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "vue/multi-word-component-names": "off",
    "vue/no-multiple-template-root": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

```json
// prettier.config.js
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  vueIndentScriptAndStyle: true
}
```

## 4. Git Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,vue,ts}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,vue}": ["stylelint --fix", "prettier --write"]
  }
}
```

## 5. 环境变量管理

```bash
# .env.example
NUXT_PUBLIC_API_BASE_URL=https://tool-internal.wyld.cc/api/v1
NUXT_PUBLIC_APP_VERSION=1.1.0
NUXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NUXT_PUBLIC_GA_ID=your_ga_id
```

## 6. 性能监控

```javascript
// plugins/performance.client.js
export default defineNuxtPlugin(() => {
  // Web Vitals 监控
  if (process.client) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }
})
```