#!/usr/bin/env sh

# 确保脚本在错误时停止执行
set -e

# 确保你处于项目的根目录
cd "$(dirname "$0")"

# 检查APP_VERSION环境变量
if [ -z "$APP_VERSION" ]; then
  echo "警告: 未设置APP_VERSION环境变量，将使用默认版本号"
  export APP_VERSION="1.0.0"
  echo "使用默认版本号: $APP_VERSION"
fi

# 检查Git LFS是否已安装
if ! command -v git-lfs &> /dev/null; then
  echo "错误: 未安装Git LFS，请先安装Git LFS"
  echo "Mac上安装方法: brew install git-lfs"
  echo "Windows上安装方法: https://git-lfs.github.com/"
  exit 1
fi

# 删除符号链接（如果存在）
if [ -L "dist" ]; then
  rm dist
  echo "已删除符号链接 dist"
fi

# 清除之前的构建
echo "清除之前的构建..."
rm -rf .output 
rm -rf dist
mkdir -p dist

# 安装依赖
echo "安装网站依赖..."
pnpm install || { echo "依赖安装失败"; exit 1; }

# 强制清除 Nuxt 缓存
echo "清除 Nuxt 缓存 (.nuxt)..."
rm -rf .nuxt

# 构建项目，设置自定义环境变量
echo "开始构建网站 (版本号: $APP_VERSION)..."
BUILD_TIME_APP_VERSION=$APP_VERSION pnpm run generate || { echo "构建失败"; exit 1; }

# 检查 .output/public 目录是否存在
if [ -d ".output/public" ]; then
  # 如果存在，复制到 dist 目录
  mkdir -p dist
  cp -r .output/public/* dist/
  echo "已将构建后的文件复制到 dist 目录"
elif [ ! -d "dist" ]; then
  echo "错误: 未找到生成的 dist 或 .output/public 目录!"
  exit 1
fi

# 确保更新目录存在
if [ ! -d "public/update" ]; then
  echo "警告: 更新目录不存在，请先准备好更新文件"
  mkdir -p public/update
fi

# 确保更新目录被复制到dist
if [ -d "public/update" ]; then
  mkdir -p dist/update
  cp -r public/update/* dist/update/ 2>/dev/null || echo "更新目录为空或复制过程出错"
  echo "更新文件已复制到dist目录"
fi

# 我们不再需要修复资源路径，因为已经在Nuxt配置和前端代码中处理了
echo "修复HTML文件和资源路径..."

# 修复HTML文件的资源引用
if [ -f "dist/index.html" ]; then
  echo "修复index.html文件中的资源路径..."
  # 对于自定义域名，移除/chef-web前缀
  sed -i.bak 's|href="/chef-web/_nuxt/|href="/_nuxt/|g' dist/index.html
  sed -i.bak 's|src="/chef-web/_nuxt/|src="/_nuxt/|g' dist/index.html
  # 确保路径格式正确
  sed -i.bak 's|href="/_nuxt/|href="/_nuxt/|g' dist/index.html
  sed -i.bak 's|src="/_nuxt/|src="/_nuxt/|g' dist/index.html
  if [ -f "dist/index.html.bak" ]; then
    rm dist/index.html.bak
  fi
fi

# 检查其他HTML文件
find dist -name "*.html" -not -path "dist/index.html" | while read html_file; do
  echo "修复 $html_file 文件中的资源路径..."
  # 对于自定义域名，移除/chef-web前缀
  sed -i.bak 's|href="/chef-web/_nuxt/|href="/_nuxt/|g' "$html_file"
  sed -i.bak 's|src="/chef-web/_nuxt/|src="/_nuxt/|g' "$html_file"
  # 确保路径格式正确
  sed -i.bak 's|href="/_nuxt/|href="/_nuxt/|g' "$html_file"
  sed -i.bak 's|src="/_nuxt/|src="/_nuxt/|g' "$html_file"
  if [ -f "${html_file}.bak" ]; then
    rm "${html_file}.bak"
  fi
done

# 解决'static'目录的问题
echo "修复可能的静态目录引用..."
find dist -name "*.html" | while read html_file; do
  echo "处理静态目录引用: $html_file"
  sed -i.bak 's|href="/chef-web/static/|href="/_nuxt/|g' "$html_file"
  sed -i.bak 's|src="/chef-web/static/|src="/_nuxt/|g' "$html_file"
  sed -i.bak 's|href="/static/|href="/_nuxt/|g' "$html_file"
  sed -i.bak 's|src="/static/|src="/_nuxt/|g' "$html_file"
  if [ -f "${html_file}.bak" ]; then
    rm "${html_file}.bak"
  fi
done

# 确保字体目录被正确复制
echo "字体文件将从OSS加载，跳过本地字体处理..."
# 创建空字体目录，以避免可能的404错误
mkdir -p dist/font

# 进入 dist 目录
cd dist

# 创建 .nojekyll 文件 (避免 GitHub Pages 使用 Jekyll 处理)
touch .nojekyll

# 使用Git LFS进行部署
echo "初始化Git LFS..."
git init -b main
git lfs install

# 配置Git LFS追踪DMG文件
echo "配置Git LFS追踪大文件..."
git lfs track "*.dmg"
git lfs track "*.exe"
git lfs track "*.zip"
git lfs track "*.ttf"
git add .gitattributes

# 配置用户信息
git config user.name "Chef Deployer"
git config user.email "deploy@chef.com"

# 使用自定义域名
echo "设置自定义域名..."
echo "chef.wyld.cc" > CNAME

# 修复资源路径的404问题 (特殊情况)
echo "创建.nojekyll和404.html文件..."
# 创建.nojekyll文件避免GitHub Pages使用Jekyll处理
touch .nojekyll
# 复制index.html到404.html以处理客户端路由
if [ -f "index.html" ]; then
  cp index.html 404.html
  echo "已创建404.html文件"
fi

# 调试信息 - 查看HTML文件中的资源引用
echo "检查资源引用路径..."
grep -r "href=\"\/" dist/*.html | head -n 5
grep -r "src=\"\/" dist/*.html | head -n 5

# 添加所有文件
echo "添加所有文件到Git..."
git add -A

# 提交更改
COMMIT_MSG="deploy: 更新应用版本 $APP_VERSION ($(date '+%Y-%m-%d %H:%M:%S'))"
echo "提交信息: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 检查 dist 目录大小
echo "检查 dist 目录大小..."
du -sh .

# 检查 update 目录大小 (如果存在)
if [ -d "update" ]; then
  echo "检查 update 目录大小..."
  du -sh update
fi

# 检查 Git LFS 状态
echo "检查 Git LFS 状态..."
git lfs ls-files

# 获取当前用户名和仓库名
REPO_URL=$(git config --get remote.origin.url 2>/dev/null || echo "git@github.com:1510207073/chef-web.git")
echo "将推送到: $REPO_URL"

# 推送到 gh-pages 分支
echo "正在推送到GitHub Pages (使用Git LFS)..."
git push -f $REPO_URL main:gh-pages

# 检查推送结果
if [ $? -ne 0 ]; then
  echo "推送失败，可能的原因:"
  echo "1. GitHub可能拒绝了大文件 (超过100MB的单个文件限制)"
  echo "2. 没有正确的仓库访问权限"
  echo "3. 网络问题"
  echo ""
  echo "建议："
  echo "- 检查是否有超大文件，特别是update目录中的文件"
  echo "- 确保已添加GitHub SSH密钥"
  echo "- 考虑使用其他服务托管较大的更新文件"
  cd ..
  exit 1
else
  # 返回项目根目录
  cd ..
  echo "推送成功！"
fi

echo "部署完成！"
echo "网站已部署到: https://chef.wyld.cc"
echo "GitHub Pages URL: https://1510207073.github.io/chef-web"
