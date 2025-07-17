// 图片懒加载和优化 composable
export const useImageOptimization = () => {
  const imageCache = new Map()
  
  const optimizeImageUrl = (url, options = {}) => {
    if (!url) return ''
    
    const {
      width = 400,
      height = 300,
      quality = 80,
      format = 'webp'
    } = options
    
    // 如果是外部图片，可以使用图片 CDN 服务
    if (url.startsWith('http')) {
      // 示例：使用 imagekit.io 或其他 CDN
      return `${url}?tr=w-${width},h-${height},q-${quality},f-${format}`
    }
    
    return url
  }

  const preloadImage = (src) => {
    if (imageCache.has(src)) {
      return Promise.resolve()
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        imageCache.set(src, true)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  const lazyLoadImage = (ref, src, placeholder = '/images/placeholder.svg') => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            try {
              await preloadImage(src)
              entry.target.src = src
            } catch {
              entry.target.src = placeholder
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (ref.value) {
      observer.observe(ref.value)
    }

    return () => observer.disconnect()
  }

  return {
    optimizeImageUrl,
    preloadImage,
    lazyLoadImage
  }
}

// 缓存管理 composable
export const useCache = () => {
  const cache = new Map()
  const TTL = 5 * 60 * 1000 // 5分钟

  const set = (key, value, ttl = TTL) => {
    cache.set(key, {
      value,
      expires: Date.now() + ttl
    })
  }

  const get = (key) => {
    const item = cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      cache.delete(key)
      return null
    }
    
    return item.value
  }

  const clear = () => {
    cache.clear()
  }

  return { set, get, clear }
}