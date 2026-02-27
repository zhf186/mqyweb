'use client'

/**
 * Visual Editor Toolbar Component
 * 可视化编辑器工具栏组件
 * 
 * Features:
 * - Edit mode toggle button
 * - Device size selector
 * - Language switcher
 * - Save and close buttons
 * - Responsive layout for mobile/desktop
 */

import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, Edit3, Save, X, Languages } from 'lucide-react'
import { DeviceSizeSelector } from './DeviceSizeSelector'
import type { DeviceSize, Locale } from '@/lib/visual-editor/types'

interface VisualEditorToolbarProps {
  // Page info
  pageSlug: string
  
  // Mode state
  mode: 'preview' | 'edit'
  onModeToggle: () => void
  
  // Device size
  deviceSize: DeviceSize
  onDeviceSizeChange: (size: DeviceSize) => void
  
  // Language
  locale: Locale
  onLocaleToggle: () => void
  
  // Save state
  hasUnsavedChanges: boolean
  onSave: () => void
  
  // Navigation
  onClose: () => void
}

export function VisualEditorToolbar({
  pageSlug,
  mode,
  onModeToggle,
  deviceSize,
  onDeviceSizeChange,
  locale,
  onLocaleToggle,
  hasUnsavedChanges,
  onSave,
  onClose,
}: VisualEditorToolbarProps) {
  return (
    <>
      {/* Main Toolbar */}
      <div className="h-14 sm:h-16 border-b bg-white flex items-center justify-between px-3 sm:px-4 shadow-sm">
        {/* Left: Back button and page info */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="gap-1 sm:gap-2 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">返回</span>
          </Button>
          <div className="h-4 sm:h-6 w-px bg-gray-300 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              可视化编辑器
            </h1>
            <p className="text-xs text-gray-500 truncate">
              {pageSlug}
            </p>
          </div>
        </div>

        {/* Center: Device size selector and language toggle - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-3">
          <DeviceSizeSelector
            value={deviceSize}
            onChange={onDeviceSizeChange}
          />
          <div className="h-6 w-px bg-gray-300" />
          <Button
            variant="outline"
            size="sm"
            onClick={onLocaleToggle}
            className="gap-2"
            title="切换语言"
          >
            <Languages className="h-4 w-4" />
            {locale === 'zh' ? '中文' : 'EN'}
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {hasUnsavedChanges && (
            <span className="hidden sm:inline text-xs text-orange-600 mr-2">
              有未保存的修改
            </span>
          )}
          <Button
            variant={mode === 'preview' ? 'outline' : 'default'}
            size="sm"
            onClick={onModeToggle}
            className="gap-1 sm:gap-2"
          >
            {mode === 'preview' ? (
              <>
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">编辑</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">预览</span>
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!hasUnsavedChanges}
            onClick={onSave}
            className="gap-1 sm:gap-2"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">保存</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="gap-1 sm:gap-2"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">关闭</span>
          </Button>
        </div>
      </div>

      {/* Mobile Controls - Shown only on mobile/tablet */}
      <div className="lg:hidden border-b bg-gray-50 px-3 py-2 space-y-2">
        {/* Device size selector */}
        <div className="flex items-center justify-center">
          <DeviceSizeSelector
            value={deviceSize}
            onChange={onDeviceSizeChange}
          />
        </div>
        {/* Language toggle */}
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onLocaleToggle}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {locale === 'zh' ? '切换到英文' : 'Switch to Chinese'}
          </Button>
        </div>
      </div>
    </>
  )
}
