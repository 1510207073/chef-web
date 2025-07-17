# 一键大厨 Web 项目

这是一个基于 Nuxt.js 构建的一键大厨官网项目，包含菜谱详情页功能，用于微信分享的落地页。

## 新增功能

### 1. 游客Token自动获取
- 网站加载时自动获取游客token
- Token保存到本地存储
- 支持token刷新和错误处理

### 2. 菜谱详情页
- 路由: `/recipe/[id]` (例如: `/recipe/67`)
- 展示菜谱封面、名称、描述
- 显示主料、辅料、调料信息
- 作者信息展示
- 响应式设计，兼容手机设备
- 底部"打开APP查看更多"按钮，支持深度链接

### 3. API测试页面
- 路由: `/test`
- 测试token获取功能
- 测试菜谱API调用
- 提供快速链接到菜谱详情页

## 项目结构

```
├── composables/
│   ├── useAuth.js          # 认证管理
│   └── useRecipe.js        # 菜谱API
├── pages/
│   ├── index.vue           # 首页（包含开发测试链接）
│   ├── test.vue            # API测试页面
│   └── recipe/
│       └── [id].vue        # 菜谱详情页
└── public/images/
    ├── placeholder-recipe.svg  # 默认菜谱图片
    └── placeholder-avatar.svg  # 默认头像
```

## API接口

### 获取游客Token
```bash
curl --location --request POST 'https://tool-internal.wyld.cc/api/v1/auth/token/guest?app_id=onechef&app_version=1.1.0&source=app&os=ios&os_version=18.5&device=iPhone&device_version=18.5' \
--header 'user-agent: Dart/3.8 (dart:io)' \
--header 'content-type: application/json' \
--header 'accept-encoding: gzip' \
--header 'content-length: 14' \
--header 'host: tool-internal.wyld.cc' \
--data-raw '{"ident":null}'
```

### 获取菜谱详情
```bash
curl --location --request GET 'https://tool-internal.wyld.cc/api/v1/onechef/recipe/67?app_id=onechef&app_version=1.1.0&source=app&os=ios&os_version=18.5&device=iPhone&device_version=18.5' \
--header 'user-agent: Dart/3.8 (dart:io)' \
--header 'content-type: application/json' \
--header 'accept-encoding: gzip' \
--header 'authorization: Bearer [ACCESS_TOKEN]' \
--header 'host: tool-internal.wyld.cc'
```

## 开发指南

### 启动开发服务器
```bash
npm run dev
```

### 测试功能
1. 访问 `http://localhost:3000/` - 首页（开发环境下会显示测试链接）
2. 访问 `http://localhost:3000/test` - API测试页面
3. 访问 `http://localhost:3000/recipe/67` - 菜谱详情页示例

### 微信分享配置
菜谱详情页已配置了Open Graph标签，支持微信分享时显示：
- 菜谱名称
- 菜谱描述
- 菜谱封面图片

### APP深度链接
点击"打开APP查看更多"按钮时：
1. 尝试通过scheme `onechef://recipe/[id]` 打开APP
2. 如果APP未安装，2秒后跳转到App Store下载页面

## 部署说明

### 构建项目
```bash
npm run build
```

### 生成静态文件
```bash
npm run generate
```

## 注意事项

1. **CORS问题**: 如果在生产环境遇到CORS问题，需要配置服务器允许跨域请求
2. **Token过期**: 目前实现了基础的token管理，如需要可以添加自动刷新功能
3. **错误处理**: 已添加基础的错误处理和重试机制
4. **图片加载**: 使用了SVG格式的占位图片，确保快速加载
5. **响应式设计**: 菜谱详情页已优化移动端显示效果

## 技术栈

- **框架**: Nuxt.js 3
- **UI库**: Element Plus, Nuxt UI
- **样式**: CSS3, 响应式设计
- **图标**: SVG
- **状态管理**: Composables
- **路由**: Nuxt.js 文件路由

## 更新日志

### v1.0.0 (2025-01-16)
- ✅ 实现游客token自动获取和本地存储
- ✅ 创建菜谱详情页，支持移动端响应式设计
- ✅ 添加API测试页面
- ✅ 实现APP深度链接功能
- ✅ 配置微信分享优化
- ✅ 添加错误处理和占位图片