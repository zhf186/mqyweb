import type { EditableElement } from './types'

/**
 * 检测页面中所有可编辑元素
 * @param document - DOM文档对象
 * @returns 可编辑元素数组
 */
export function detectEditableElements(document: Document): EditableElement[] {
  const elements = document.querySelectorAll('[data-editable]')
  
  return Array.from(elements).map((el, index) => {
    const rect = el.getBoundingClientRect()
    const fieldKey = el.getAttribute('data-editable')!
    const type = el.getAttribute('data-editable-type') as 'text' | 'image'
    const label = el.getAttribute('data-editable-label') || fieldKey
    const linkHref = resolveLinkHref(el)
    
    // 获取内容
    let contentZh = ''
    let contentEn = ''
    
    if (type === 'text') {
      contentZh = el.textContent?.trim() || ''
      contentEn = contentZh // 暂时使用相同内容，后续从CMS获取
    } else if (type === 'image') {
      const imgElement = el as HTMLImageElement
      contentZh = imgElement.src || imgElement.getAttribute('src') || ''
      contentEn = contentZh
    }
    
    return {
      id: `editable-${index}`,
      fieldKey,
      type,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        bottom: rect.bottom,
        right: rect.right,
      },
      selector: generateSelector(el),
      contentZh,
      contentEn,
      linkHref,
      label,
      isRequired: false,
    }
  })
}

function resolveLinkHref(element: Element): string | undefined {
  const explicitHref = element.getAttribute('href')
  if (explicitHref) {
    return explicitHref
  }

  const nearestAnchor = element.closest('a')
  if (nearestAnchor) {
    return nearestAnchor.getAttribute('href') || nearestAnchor.getAttribute('data-editable-href') || undefined
  }

  const editableHref = element.getAttribute('data-editable-href')
  return editableHref || undefined
}

/**
 * 生成元素的唯一CSS选择器
 * @param element - DOM元素
 * @returns CSS选择器字符串
 */
function generateSelector(element: Element): string {
  const path: string[] = []
  let current: Element | null = element
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()
    
    // 如果有ID，直接使用ID并停止
    if (current.id) {
      selector += `#${current.id}`
      path.unshift(selector)
      break
    }
    
    // 如果有data-editable属性，使用它作为唯一标识
    const editableKey = current.getAttribute('data-editable')
    if (editableKey) {
      selector += `[data-editable="${editableKey}"]`
      path.unshift(selector)
      break
    }
    
    // 添加类名
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.split(' ').filter(c => c.trim())
      if (classes.length > 0) {
        // 只使用前3个类名，避免选择器过长
        selector += `.${classes.slice(0, 3).join('.')}`
      }
    }
    
    // 添加nth-child以确保唯一性
    if (current.parentElement) {
      const siblings = Array.from(current.parentElement.children)
      const index = siblings.indexOf(current)
      if (index > 0 || siblings.length > 1) {
        selector += `:nth-child(${index + 1})`
      }
    }
    
    path.unshift(selector)
    current = current.parentElement
  }
  
  return path.join(' > ')
}

/**
 * 根据选择器查找元素
 * @param selector - CSS选择器
 * @param document - DOM文档对象
 * @returns 找到的元素或null
 */
export function findElementBySelector(selector: string, document: Document): Element | null {
  try {
    return document.querySelector(selector)
  } catch (error) {
    console.error('Invalid selector:', selector, error)
    return null
  }
}

/**
 * 计算元素相对于视口的位置
 * @param element - DOM元素
 * @returns DOMRect对象
 */
export function getElementRect(element: Element): DOMRect {
  return element.getBoundingClientRect()
}

/**
 * 更新元素内容
 * @param element - DOM元素
 * @param content - 新内容
 * @param type - 元素类型
 */
export function updateElementContent(element: Element, content: string, type: 'text' | 'image'): void {
  // 添加更新动画效果
  element.classList.add('visual-editor-updating')
  
  // 更新内容
  if (type === 'text') {
    element.textContent = content
    
    // 移除动画类
    setTimeout(() => {
      element.classList.remove('visual-editor-updating')
    }, 500)
  } else if (type === 'image') {
    // 对于Next.js Image组件，我们需要通知父窗口刷新iframe
    // 因为Next.js Image组件不是简单的<img>标签，直接修改src不会生效
    console.log('[updateElementContent] Image update requested, notifying parent to refresh')
    
    // 通知父窗口需要刷新iframe以显示新图片
    window.parent.postMessage({
      type: 'IMAGE_UPDATED_REFRESH_NEEDED',
      payload: {
        fieldKey: element.getAttribute('data-editable'),
        imagePath: content
      }
    }, window.location.origin)
    
    // 移除动画类
    setTimeout(() => {
      element.classList.remove('visual-editor-updating')
    }, 500)
  }
}

export function updateElementLinkHref(element: Element, href: string): void {
  element.setAttribute('data-editable-href', href)

  const target = element instanceof HTMLAnchorElement ? element : element.closest('a')
  if (target) {
    target.setAttribute('href', href)
  }
}

/**
 * 添加全局样式用于更新动画
 * 这个函数应该在编辑模式初始化时调用一次
 */
export function injectUpdateAnimationStyles(): void {
  // 检查是否已经注入
  if (document.getElementById('visual-editor-styles')) {
    return
  }
  
  const style = document.createElement('style')
  style.id = 'visual-editor-styles'
  style.textContent = `
    @keyframes visual-editor-pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
      }
    }
    
    .visual-editor-updating {
      animation: visual-editor-pulse 0.5s ease-in-out;
      transition: all 0.3s ease;
    }
    
    img.visual-editor-updating {
      transition: opacity 0.3s ease;
    }
  `
  document.head.appendChild(style)
}
