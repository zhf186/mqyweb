'use client'

/**
 * Visual Editor Component
 * 可视化编辑器主组件
 * 
 * Features:
 * - Preview mode and edit mode toggle
 * - Device size switching (desktop, tablet, mobile)
 * - Language switching (Chinese, English)
 * - Editable element detection and highlighting
 * - Inline editing dialogs
 * - Real-time content updates
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { PreviewFrame, type PreviewFrameRef } from './PreviewFrame'
import { VisualEditorToolbar } from './VisualEditorToolbar'
import { CloseConfirmDialog } from './CloseConfirmDialog'
import { EditOverlay } from './EditOverlay'
import { TextEditDialog } from './TextEditDialog'
import { ImageEditDialog } from './ImageEditDialog'
import { contentApi } from '@/lib/api/admin'
import type { DeviceSize, Locale, IframeBridgeMessage, EditableElement } from '@/lib/visual-editor/types'

interface VisualEditorProps {
  pageSlug: string
}

export function VisualEditor({ pageSlug }: VisualEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const previewFrameRef = useRef<PreviewFrameRef>(null)
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop')
  const [locale, setLocale] = useState<Locale>('zh')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Element interaction state
  const [editableElements, setEditableElements] = useState<EditableElement[]>([])
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  
  // Edit dialog state
  const [isTextDialogOpen, setIsTextDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [editingElement, setEditingElement] = useState<EditableElement | null>(null)
  
  // Close confirmation dialog state
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
    toast({
      title: '预览加载完成',
      description: '页面已准备就绪',
    })
  }

  // Handle iframe error
  const handleIframeError = (error: Error) => {
    setIsLoading(false)
    toast({
      title: '预览加载失败',
      description: error.message,
      variant: 'destructive',
    })
  }

  // Handle messages from iframe
  const handleIframeMessage = (message: IframeBridgeMessage) => {
    console.log('Received message from iframe:', message)
    
    switch (message.type) {
      case 'EDITABLE_ELEMENTS_RESPONSE':
        // Store editable elements received from iframe
        if (message.payload && Array.isArray(message.payload)) {
          setEditableElements(message.payload)
          console.log(`Received ${message.payload.length} editable elements`)
          toast({
            title: '可编辑元素已加载',
            description: `检测到 ${message.payload.length} 个可编辑元素`,
          })
        }
        break
        
      case 'ELEMENT_CLICKED':
        // Handle element click from iframe
        if (message.payload && message.payload.elementId) {
          handleElementClick(message.payload.elementId)
        }
        break
        
      case 'ELEMENT_HOVERED':
        // Handle element hover from iframe
        if (message.payload) {
          setHoveredElementId(message.payload.elementId)
        }
        break
      
      case 'IMAGE_UPDATED_REFRESH_NEEDED':
        // Handle image update - refresh iframe to show new image
        console.log('[VisualEditor] Image updated, refreshing iframe...')
        if (previewFrameRef.current) {
          const iframeElement = previewFrameRef.current.iframeRef.current
          if (iframeElement) {
            // Preserve current scroll position
            const scrollY = iframeElement.contentWindow?.scrollY || 0
            
            // Reset bridge ready state before reload
            const bridge = previewFrameRef.current.getBridge()
            if (bridge) {
              // Bridge will be re-marked as ready when iframe sends IFRAME_READY
              bridge.destroy()
            }
            
            // Reload iframe by appending a cache-busting param
            const url = new URL(iframeElement.src, window.location.origin)
            url.searchParams.set('_t', Date.now().toString())
            iframeElement.src = url.toString()
            
            // After reload, restore state
            const onReload = () => {
              iframeElement.removeEventListener('load', onReload)
              
              // Re-create bridge
              if (previewFrameRef.current) {
                // markAsReady will be called by handleLoad in PreviewFrame
              }
              
              setTimeout(() => {
                // Restore scroll position
                iframeElement.contentWindow?.scrollTo(0, scrollY)
                
                // Re-enter edit mode after reload
                if (mode === 'edit') {
                  previewFrameRef.current?.sendMessage({
                    type: 'INIT_EDIT_MODE',
                    payload: { locale },
                  })
                  setTimeout(() => {
                    previewFrameRef.current?.sendMessage({
                      type: 'REQUEST_EDITABLE_ELEMENTS',
                    })
                  }, 300)
                }
              }, 200)
            }
            
            iframeElement.addEventListener('load', onReload)
          }
        }
        break
        
      default:
        console.debug('Unhandled message type:', message.type)
    }
  }

  // Handle close with unsaved changes warning
  const handleClose = () => {
    if (hasUnsavedChanges) {
      setIsCloseDialogOpen(true)
    } else {
      router.push('/admin/content')
    }
  }
  
  // Confirm close
  const confirmClose = () => {
    setIsCloseDialogOpen(false)
    router.push('/admin/content')
  }
  
  // Handle batch save
  const handleSave = async () => {
    if (!hasUnsavedChanges) return
    
    try {
      toast({
        title: '保存中...',
        description: '正在保存所有修改',
      })
      
      // In the current implementation, changes are saved immediately
      // This is a placeholder for future batch save functionality
      setHasUnsavedChanges(false)
      
      toast({
        title: '保存成功',
        description: '所有修改已保存',
      })
    } catch (error) {
      console.error('Failed to save:', error)
      toast({
        title: '保存失败',
        description: error instanceof Error ? error.message : '保存时发生错误',
        variant: 'destructive',
      })
    }
  }

  // Toggle edit mode with animation
  const toggleMode = () => {
    if (isTransitioning) return // Prevent rapid toggling
    
    setIsTransitioning(true)
    const newMode = mode === 'preview' ? 'edit' : 'preview'
    
    // Smooth transition
    setTimeout(() => {
      setMode(newMode)
      
      // Send message to iframe via bridge
      if (newMode === 'edit') {
        console.log('[VisualEditor] Sending INIT_EDIT_MODE message')
        previewFrameRef.current?.sendMessage({
          type: 'INIT_EDIT_MODE',
          payload: { locale },
        })
        
        // Request editable elements from iframe
        setTimeout(() => {
          console.log('[VisualEditor] Sending REQUEST_EDITABLE_ELEMENTS message')
          previewFrameRef.current?.sendMessage({
            type: 'REQUEST_EDITABLE_ELEMENTS',
          })
        }, 100)
        
        toast({
          title: '已进入编辑模式',
          description: '点击页面上的元素进行编辑',
        })
      } else {
        previewFrameRef.current?.sendMessage({
          type: 'EXIT_EDIT_MODE',
        })
        
        // Clear element state when exiting edit mode
        setEditableElements([])
        setHoveredElementId(null)
        setSelectedElementId(null)
        
        toast({
          title: '已退出编辑模式',
          description: '现在处于预览模式',
        })
      }
      
      // End transition
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 50)
  }

  // Request updated element positions (for scroll handling)
  const refreshElementPositions = useCallback(() => {
    if (mode === 'edit') {
      previewFrameRef.current?.sendMessage({
        type: 'REQUEST_EDITABLE_ELEMENTS',
      })
    }
  }, [mode])

  // Set up scroll listener for iframe to refresh positions
  useEffect(() => {
    if (mode !== 'edit') return

    // Request position updates periodically when scrolling
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        console.log('[VisualEditor] Scroll detected, refreshing element positions')
        refreshElementPositions()
      }, 150) // Debounce scroll events
    }

    // Listen for scroll messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'IFRAME_SCROLLED') {
        handleScroll()
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(scrollTimeout)
    }
  }, [mode, refreshElementPositions])

  // Handle element hover
  const handleElementHover = (elementId: string | null) => {
    setHoveredElementId(elementId)
  }

  // Handle element click
  const handleElementClick = (elementId: string) => {
    setSelectedElementId(elementId)
    
    // Find the element
    const element = editableElements.find(el => el.id === elementId)
    if (element) {
      console.log('Element clicked:', element)
      
      // Open appropriate dialog based on element type
      if (element.type === 'text') {
        setEditingElement(element)
        setIsTextDialogOpen(true)
        toast({
          title: '打开文字编辑器',
          description: element.label,
        })
      } else if (element.type === 'image') {
        setEditingElement(element)
        setIsImageDialogOpen(true)
        toast({
          title: '打开图片编辑器',
          description: element.label,
        })
      }
    }
  }

  // Handle text save
  const handleTextSave = async (contentZh: string, contentEn: string) => {
    if (!editingElement) return

    try {
      // Find the content item by fieldKey
      // We need to get the pageId first
      const pagesResponse = await contentApi.getPages()
      const pages = pagesResponse.data
      const currentPage = pages.find((p: any) => p.slug === pageSlug)
      
      if (!currentPage) {
        throw new Error('页面未找到')
      }

      // Get page content to find the content item
      const pageContentResponse = await contentApi.getPageContent(currentPage.id)
      const { contentItems } = pageContentResponse.data
      const contentItem = contentItems.find((item: any) => item.fieldKey === editingElement.fieldKey)

      if (!contentItem) {
        throw new Error('内容项未找到')
      }

      // Update the content item
      await contentApi.updateContentItem(contentItem.id, {
        contentZh,
        contentEn,
        version: contentItem.version,
        changeSummary: `通过可视化编辑器更新: ${editingElement.label}`,
      })

      // Update local state
      setEditableElements(prev =>
        prev.map(el =>
          el.id === editingElement.id
            ? { ...el, contentZh, contentEn }
            : el
        )
      )

      // Mark as having unsaved changes (will be cleared after preview update)
      setHasUnsavedChanges(true)

      toast({
        title: '保存成功',
        description: `${editingElement.label} 已更新`,
      })

      // Send update message to iframe for real-time preview
      previewFrameRef.current?.sendMessage({
        type: 'UPDATE_CONTENT',
        payload: {
          fieldKey: editingElement.fieldKey,
          content: locale === 'zh' ? contentZh : contentEn,
          locale,
        },
      })

      // Clear unsaved changes flag after a short delay
      setTimeout(() => {
        setHasUnsavedChanges(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to save text:', error)
      throw error // Re-throw to let dialog handle it
    }
  }

  // Handle image save
  const handleImageSave = async (imagePath: string) => {
    if (!editingElement) return

    try {
      // Find the content item by fieldKey
      const pagesResponse = await contentApi.getPages()
      const pages = pagesResponse.data
      const currentPage = pages.find((p: any) => p.slug === pageSlug)
      
      if (!currentPage) {
        throw new Error('页面未找到')
      }

      // Get page content to find the content item
      const pageContentResponse = await contentApi.getPageContent(currentPage.id)
      const { contentItems } = pageContentResponse.data
      const contentItem = contentItems.find((item: any) => item.fieldKey === editingElement.fieldKey)

      if (!contentItem) {
        throw new Error('内容项未找到')
      }

      // Update the content item (image path is stored in contentZh)
      await contentApi.updateContentItem(contentItem.id, {
        contentZh: imagePath,
        contentEn: imagePath, // Images use the same path for both languages
        version: contentItem.version,
        changeSummary: `通过可视化编辑器更新图片: ${editingElement.label}`,
      })

      // Update local state
      setEditableElements(prev =>
        prev.map(el =>
          el.id === editingElement.id
            ? { ...el, contentZh: imagePath, contentEn: imagePath }
            : el
        )
      )

      // Mark as having unsaved changes (will be cleared after preview update)
      setHasUnsavedChanges(true)

      toast({
        title: '保存成功',
        description: `${editingElement.label} 图片已更新`,
      })

      // Send update message to iframe for real-time preview
      previewFrameRef.current?.sendMessage({
        type: 'UPDATE_IMAGE',
        payload: {
          fieldKey: editingElement.fieldKey,
          imagePath,
        },
      })

      // Clear unsaved changes flag after a short delay
      setTimeout(() => {
        setHasUnsavedChanges(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to save image:', error)
      throw error // Re-throw to let dialog handle it
    }
  }

  // Toggle language and update iframe
  const toggleLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh'
    setLocale(newLocale)
    
    // Send language change message to iframe
    previewFrameRef.current?.sendMessage({
      type: 'CHANGE_LOCALE',
      payload: { locale: newLocale },
    })
    
    toast({
      title: '语言已切换',
      description: newLocale === 'zh' ? '中文' : 'English',
    })
    
    // If in edit mode, refresh editable elements for new language
    if (mode === 'edit') {
      setTimeout(() => {
        previewFrameRef.current?.sendMessage({
          type: 'REQUEST_EDITABLE_ELEMENTS',
        })
      }, 500)
    }
  }

  // Handle device size change
  const handleDeviceSizeChange = (size: DeviceSize) => {
    setDeviceSize(size)
    const sizeLabels = {
      desktop: '桌面视图',
      tablet: '平板视图 (768px)',
      mobile: '手机视图 (375px)',
    }
    toast({
      title: '设备尺寸已切换',
      description: sizeLabels[size],
    })
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Toolbar */}
      <VisualEditorToolbar
        pageSlug={pageSlug}
        mode={mode}
        onModeToggle={toggleMode}
        deviceSize={deviceSize}
        onDeviceSizeChange={handleDeviceSizeChange}
        locale={locale}
        onLocaleToggle={toggleLocale}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onClose={handleClose}
      />

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden relative">
        <PreviewFrame
          ref={previewFrameRef}
          pageSlug={pageSlug}
          deviceSize={deviceSize}
          locale={locale}
          editMode={mode === 'edit'}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          onMessage={handleIframeMessage}
        />
        
        {/* Edit Overlay - shown only in edit mode */}
        {mode === 'edit' && (
          <EditOverlay
            editableElements={editableElements}
            hoveredElementId={hoveredElementId}
            selectedElementId={selectedElementId}
            onElementHover={handleElementHover}
            onElementClick={handleElementClick}
            isVisible={mode === 'edit'}
            iframeRef={previewFrameRef.current?.iframeRef}
          />
        )}
      </div>

      {/* Text Edit Dialog */}
      <TextEditDialog
        element={editingElement}
        isOpen={isTextDialogOpen}
        onClose={() => {
          setIsTextDialogOpen(false)
          setEditingElement(null)
          setSelectedElementId(null)
        }}
        onSave={handleTextSave}
      />

      {/* Image Edit Dialog */}
      <ImageEditDialog
        element={editingElement}
        pageSlug={pageSlug}
        isOpen={isImageDialogOpen}
        onClose={() => {
          setIsImageDialogOpen(false)
          setEditingElement(null)
          setSelectedElementId(null)
        }}
        onSave={handleImageSave}
      />
      
      {/* Close Confirmation Dialog */}
      <CloseConfirmDialog
        isOpen={isCloseDialogOpen}
        onClose={() => setIsCloseDialogOpen(false)}
        onConfirm={confirmClose}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  )
}
