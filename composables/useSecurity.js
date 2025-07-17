// 安全相关的 composable
export const useSecurity = () => {
  // XSS 防护
  const sanitizeHtml = (html) => {
    // 使用 DOMPurify 或类似库
    const div = document.createElement('div')
    div.textContent = html
    return div.innerHTML
  }

  // Token 验证
  const isTokenValid = (token) => {
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      return payload.exp > now
    } catch {
      return false
    }
  }

  // 敏感信息脱敏
  const maskSensitiveData = (data, fields = ['password', 'token', 'secret']) => {
    const masked = { ...data }
    fields.forEach(field => {
      if (masked[field]) {
        masked[field] = '***'
      }
    })
    return masked
  }

  // CSP 头部设置
  const getCSPHeaders = () => ({
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://tool-internal.wyld.cc",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  })

  return {
    sanitizeHtml,
    isTokenValid,
    maskSensitiveData,
    getCSPHeaders
  }
}

// 日志记录 composable
export const useLogger = () => {
  const isDev = process.env.NODE_ENV === 'development'
  
  const log = (level, message, data = {}) => {
    if (!isDev && level === 'debug') return
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: useSecurity().maskSensitiveData(data),
      userAgent: process.client ? navigator.userAgent : 'server',
      url: process.client ? window.location.href : 'server'
    }
    
    console[level](logEntry)
    
    // 在生产环境中可以发送到日志服务
    if (!isDev && level === 'error') {
      // sendToLogService(logEntry)
    }
  }

  return {
    debug: (message, data) => log('debug', message, data),
    info: (message, data) => log('info', message, data),
    warn: (message, data) => log('warn', message, data),
    error: (message, data) => log('error', message, data)
  }
}