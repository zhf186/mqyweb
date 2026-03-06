'use client'

/**
 * Image Edit Dialog Component
 * 图片编辑弹窗组件
 * 
 * Features:
 * - Current image preview
 * - Image selector with grid display
 * - Image path input (manual entry)
 * - New image preview with loading states
 * - Error handling for image loading
 * - Save and cancel actions
 */

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Image as ImageIcon, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { assetApi, type Asset } from '@/lib/api/admin'
import type { EditableElement } from '@/lib/visual-editor/types'

interface ImageEditDialogProps {
  element: EditableElement | null
  pageSlug: string
  isOpen: boolean
  onClose: () => void
  onSave: (imagePath: string) => Promise<void>
}

export function ImageEditDialog({
  element,
  pageSlug,
  isOpen,
  onClose,
  onSave,
}: ImageEditDialogProps) {
  const [imagePath, setImagePath] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // Fetch assets for this page category
  const { data: assetsResponse, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets', pageSlug],
    queryFn: () => assetApi.getAssets({ category: pageSlug }),
    enabled: isOpen,
  })

  const assets = assetsResponse?.data?.records || []

  // Update image path when element changes
  useEffect(() => {
    if (element) {
      setImagePath(element.contentZh || '')
      setError(null)
      setPreviewError(false)
      setSelectedAsset(null)
    }
  }, [element])

  // Handle asset selection
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setImagePath(asset.fileUrl)
    setPreviewError(false)
    setPreviewLoading(false)
  }

  // Handle image path change
  const handleImagePathChange = (value: string) => {
    setImagePath(value)
    setPreviewError(false)
    setPreviewLoading(true)
  }

  // Handle preview image load
  const handlePreviewLoad = () => {
    setPreviewLoading(false)
    setPreviewError(false)
  }

  // Handle preview image error
  const handlePreviewError = () => {
    setPreviewLoading(false)
    setPreviewError(true)
  }

  // Handle save
  const handleSave = async () => {
    if (!element) return

    // Validate required fields
    if (element.isRequired && !imagePath.trim()) {
      setError('图片路径为必填项')
      return
    }

    // Validate image path format
    if (imagePath && !imagePath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      setError('请输入有效的图片路径（支持 jpg, png, gif, webp, svg）')
      return
    }

    // Check if preview has error
    if (previewError && imagePath !== element.contentZh) {
      setError('新图片加载失败，请检查路径是否正确')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onSave(imagePath)
      onClose()
    } catch (err) {
      console.error('Save failed:', err)
      setError(err instanceof Error ? err.message : '保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    // Reset to original values
    if (element) {
      setImagePath(element.contentZh || '')
    }
    setError(null)
    setPreviewError(false)
    setSelectedAsset(null)
    onClose()
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    // Escape to cancel
    if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (!element) return null

  const hasChanges = imagePath !== element.contentZh
  const formatFileSize = (bytes?: number | string | null) => {
    const size = Number(bytes)
    if (!Number.isFinite(size) || size <= 0) return '--'
    if (size < 1024) return `${Math.round(size)} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>编辑图片</DialogTitle>
          <DialogDescription>
            {element.label}
            {element.isRequired && <span className="text-red-500 ml-1">*</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Image Preview */}
          <div className="space-y-2">
            <Label>当前图片</Label>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              {element.contentZh ? (
                <img
                  src={element.contentZh}
                  alt="Current"
                  className="w-full h-auto max-h-[300px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-[200px] text-gray-400">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">暂无图片</p>
                  </div>
                </div>
              )}
              <div className="hidden flex items-center justify-center h-[200px] text-gray-400">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">图片加载失败</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Selector */}
          <div className="space-y-2">
            <Label>选择图片</Label>
            {assetsLoading ? (
              <div className="flex items-center justify-center h-[200px] border rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : assets.length > 0 ? (
              <div className="border rounded-lg p-3 max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-4 gap-3">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className={cn(
                        'relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:border-blue-400 hover:shadow-md',
                        selectedAsset?.id === asset.id && 'border-blue-500 ring-2 ring-blue-200'
                      )}
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <img
                        src={asset.thumbnailUrl || asset.fileUrl}
                        alt={asset.originalFilename}
                        className="w-full h-24 object-cover"
                      />
                      {selectedAsset?.id === asset.id && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-blue-500 drop-shadow-lg" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                        {asset.originalFilename}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center text-gray-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm mb-2">该页面暂无可用图片</p>
                <Button
                  variant="link"
                  className="text-blue-500"
                  onClick={() => window.open('/admin/assets', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  前往图片管理上传
                </Button>
              </div>
            )}
          </div>

          {/* Image Path Input (Manual Entry) */}
          <div className="space-y-2">
            <Label htmlFor="image-path">
              图片路径（或手动输入）
              {element.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id="image-path"
              value={imagePath}
              onChange={(e) => handleImagePathChange(e.target.value)}
              placeholder="/brand_assets/image.jpeg"
              disabled={saving}
            />
            <p className="text-xs text-gray-500">
              支持格式: jpg, jpeg, png, gif, webp, svg
            </p>
          </div>

          {/* New Image Preview */}
          {hasChanges && imagePath && (
            <div className="space-y-2">
              <Label>新图片预览</Label>
              <div className="border rounded-lg overflow-hidden bg-gray-50 relative">
                {previewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                )}
                {previewError ? (
                  <div className="flex items-center justify-center h-[200px] text-red-400">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">图片加载失败</p>
                      <p className="text-xs mt-1">请检查路径是否正确</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={imagePath}
                    alt="Preview"
                    className="w-full h-auto max-h-[300px] object-contain"
                    onLoad={handlePreviewLoad}
                    onError={handlePreviewError}
                  />
                )}
              </div>
            </div>
          )}

          {/* Selected Image Info */}
          {selectedAsset && (
            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded text-xs text-gray-700">
              <p><strong>文件名:</strong> {selectedAsset.originalFilename}</p>
              <p><strong>尺寸:</strong> {selectedAsset.width} × {selectedAsset.height}px</p>
              <p><strong>大小:</strong> {formatFileSize(selectedAsset.fileSize)}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Field Info */}
          <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded text-xs text-gray-600">
            <p>
              <strong>字段标识:</strong> {element.fieldKey}
            </p>
            <p className="mt-1 text-gray-500">
              提示: 使用 Ctrl+S (或 Cmd+S) 快速保存，Esc 取消
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || (hasChanges && previewError)}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
