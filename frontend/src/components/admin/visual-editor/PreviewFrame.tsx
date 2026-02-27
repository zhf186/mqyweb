'use client'

/**
 * PreviewFrame Component
 * iframe预览组件
 * 
 * Features:
 * - Load frontend page in iframe
 * - Handle loading states
 * - Handle iframe load errors
 * - Device size switching
 * - PostMessage communication bridge
 * 
 * Requirements: 1.1, 1.2, 7.2, 7.3, 7.4, 2.1, 2.2
 */

import { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IframeBridge } from '@/lib/visual-editor/iframe-bridge'
import type { DeviceSize, Locale, IframeBridgeMessage } from '@/lib/visual-editor/types'

// Re-export types for convenience
export type { DeviceSize, Locale, IframeBridgeMessage }

interface PreviewFrameProps {
  pageSlug: string
  deviceSize: DeviceSize
  locale: Locale
  editMode?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
  onMessage?: (message: IframeBridgeMessage) => void
  className?: string
}

export interface PreviewFrameRef {
  sendMessage: (message: IframeBridgeMessage) => void
  getBridge: () => IframeBridge | null
  iframeRef: React.RefObject<HTMLIFrameElement>
}

export const PreviewFrame = forwardRef<PreviewFrameRef, PreviewFrameProps>(
  function PreviewFrame(
    {
      pageSlug,
      deviceSize,
      locale,
      editMode = false,
      onLoad,
      onError,
      onMessage,
      className,
    },
    ref
  ) {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const bridgeRef = useRef<IframeBridge | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [loadAttempts, setLoadAttempts] = useState(0)
    const maxLoadAttempts = 3

  // Device size styles with smooth transitions
  const sizeStyles = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-full mx-auto transition-all duration-300 ease-in-out',
    mobile: 'w-[375px] h-full mx-auto transition-all duration-300 ease-in-out',
  }

  // Device size labels for accessibility
  const sizeLabels = {
    desktop: '桌面视图',
    tablet: '平板视图 (768px)',
    mobile: '手机视图 (375px)',
  }

  // Store onMessage in a ref to avoid recreating bridge on every render
  const onMessageRef = useRef(onMessage)
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  // Initialize IframeBridge when component mounts
  useEffect(() => {
    return () => {
      if (bridgeRef.current) {
        console.log('[PreviewFrame] Destroying IframeBridge on unmount')
        bridgeRef.current.destroy()
        bridgeRef.current = null
      }
    }
  }, [])

  // Helper to create or recreate the bridge
  const ensureBridge = useCallback(() => {
    if (!iframeRef.current) return
    
    // Destroy existing bridge if any
    if (bridgeRef.current) {
      bridgeRef.current.destroy()
      bridgeRef.current = null
    }
    
    console.log('[PreviewFrame] Creating IframeBridge')
    bridgeRef.current = new IframeBridge(iframeRef.current)
    
    // Forward all messages to parent component using ref
    bridgeRef.current.on('EDITABLE_ELEMENTS_RESPONSE', (payload) => {
      onMessageRef.current?.({ type: 'EDITABLE_ELEMENTS_RESPONSE', payload })
    })
    bridgeRef.current.on('ELEMENT_CLICKED', (payload) => {
      onMessageRef.current?.({ type: 'ELEMENT_CLICKED', payload })
    })
    bridgeRef.current.on('ELEMENT_HOVERED', (payload) => {
      onMessageRef.current?.({ type: 'ELEMENT_HOVERED', payload })
    })
  }, [])

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    sendMessage: (message: IframeBridgeMessage) => {
      bridgeRef.current?.send(message)
    },
    getBridge: () => bridgeRef.current,
    iframeRef: iframeRef,
  }), [])

  // Handle iframe load success
  const handleLoad = useCallback(() => {
    console.log('[PreviewFrame] iframe loaded successfully')
    setLoading(false)
    setError(null)
    setLoadAttempts(0)
    
    // Recreate bridge on every iframe load to ensure clean state
    ensureBridge()
    
    if (bridgeRef.current) {
      console.log('[PreviewFrame] Marking bridge as ready')
      bridgeRef.current.markAsReady()
    }
    
    onLoad?.()
  }, [onLoad, ensureBridge])

  // Handle iframe load error
  const handleError = useCallback(() => {
    setLoading(false)
    const errorMsg = `无法加载页面预览 (尝试 ${loadAttempts + 1}/${maxLoadAttempts})`
    setError(errorMsg)
    
    const err = new Error(errorMsg)
    onError?.(err)
    
    setLoadAttempts(prev => prev + 1)
  }, [loadAttempts, maxLoadAttempts, onError])

  // Retry loading the iframe
  const handleRetry = useCallback(() => {
    if (loadAttempts >= maxLoadAttempts) {
      setError('加载失败次数过多，请刷新页面重试')
      return
    }
    
    setLoading(true)
    setError(null)
    
    // Force iframe reload by changing src
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc
        }
      }, 100)
    }
  }, [loadAttempts, maxLoadAttempts])

  // Build iframe URL with query parameters
  // Map pageSlug to actual frontend route
  const getPageRoute = (slug: string): string => {
    // Map CMS page slugs to frontend routes
    const routeMap: Record<string, string> = {
      'home': '/',
      'about': '/about',
      'routes': '/routes',
      'ebike': '/ebike',
      'goods': '/goods',
      'community': '/community',
      'partners': '/partners',
    }
    
    return routeMap[slug] || `/${slug}`
  }
  
  const pageRoute = getPageRoute(pageSlug)
  // Always load iframe with editMode=true so postMessage listener is set up
  // The actual edit mode is controlled by messages from parent
  const iframeUrl = `${pageRoute}?editMode=true&locale=${locale}`

  return (
    <div className={cn('relative h-full bg-gray-100', className)}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">加载预览中...</p>
            <p className="text-xs text-gray-400 mt-1">{sizeLabels[deviceSize]}</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
          <div className="text-center max-w-md px-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                刷新页面
              </Button>
              {loadAttempts < maxLoadAttempts && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRetry}
                >
                  重试 ({maxLoadAttempts - loadAttempts} 次机会)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Iframe container with device size styling */}
      <div className="h-full flex items-start justify-center overflow-auto py-4">
        <div className={cn(sizeStyles[deviceSize], 'shadow-lg')}>
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            className="w-full h-full border-0 bg-white"
            title={`${pageSlug} 预览 - ${sizeLabels[deviceSize]}`}
            onLoad={handleLoad}
            onError={handleError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  )
})
