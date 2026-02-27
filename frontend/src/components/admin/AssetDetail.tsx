'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Asset, assetApi, AssetUsage } from '@/lib/api/admin'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, RefreshCw, Trash2, ExternalLink, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssetDetailProps {
  asset: Asset
  onClose: () => void
  onReplace: (assetId: string, file: File) => Promise<void>
  onDelete: (assetId: string) => void
}

export default function AssetDetail({
  asset,
  onClose,
  onReplace,
  onDelete,
}: AssetDetailProps) {
  const [selectedSize, setSelectedSize] = useState<'original' | 'large' | 'medium' | 'small' | 'thumbnail'>('original')

  // Fetch usage information
  const { data: usagesResponse, isLoading: usagesLoading } = useQuery({
    queryKey: ['asset-usage', asset.id],
    queryFn: () => assetApi.getAssetUsage(asset.id),
  })

  const usages = usagesResponse?.data

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSizeUrl = () => {
    switch (selectedSize) {
      case 'large': return asset.largeUrl
      case 'medium': return asset.mediumUrl
      case 'small': return asset.smallUrl
      case 'thumbnail': return asset.thumbnailUrl
      default: return asset.fileUrl
    }
  }

  const handleReplace = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        await onReplace(asset.id, file)
        onClose()
      }
    }
    input.click()
  }

  const handleDelete = () => {
    if (usages && usages.length > 0) {
      if (!confirm(`此图片正在 ${usages.length} 个位置使用，确定要删除吗？删除后相关内容将无法显示图片。`)) {
        return
      }
    } else {
      if (!confirm('确定要删除此图片吗？')) {
        return
      }
    }
    onDelete(asset.id)
  }

  const handleDownload = () => {
    const url = getSizeUrl()
    const link = document.createElement('a')
    link.href = url
    link.download = asset.originalFilename
    link.click()
  }

  const hasUsages = usages && usages.length > 0

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>图片详情</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="info">信息</TabsTrigger>
            <TabsTrigger value="usage">使用情况</TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            {/* Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">尺寸:</span>
              <div className="flex gap-2">
                {[
                  { key: 'original', label: '原图' },
                  { key: 'large', label: '大图' },
                  { key: 'medium', label: '中图' },
                  { key: 'small', label: '小图' },
                  { key: 'thumbnail', label: '缩略图' },
                ].map((size) => (
                  <Button
                    key={size.key}
                    variant={selectedSize === size.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size.key as any)}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            <div className="border rounded-lg overflow-hidden bg-muted">
              <img
                src={getSizeUrl()}
                alt={asset.altTextZh || asset.originalFilename}
                className="w-full h-auto"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                下载
              </Button>
              <Button variant="outline" onClick={handleReplace}>
                <RefreshCw className="w-4 h-4 mr-2" />
                替换
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={hasUsages}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
              {hasUsages && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  图片正在使用中
                </span>
              )}
            </div>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">文件名</label>
                <p className="mt-1">{asset.originalFilename}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">分类</label>
                <p className="mt-1">
                  <Badge>{asset.category}</Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">文件大小</label>
                <p className="mt-1">{formatFileSize(asset.fileSize)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">尺寸</label>
                <p className="mt-1">{asset.width} × {asset.height} px</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">格式</label>
                <p className="mt-1">{asset.mimeType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">处理状态</label>
                <p className="mt-1">
                  {asset.processingStatus === 'completed' && <Badge variant="default">已处理</Badge>}
                  {asset.processingStatus === 'processing' && <Badge variant="secondary">处理中</Badge>}
                  {asset.processingStatus === 'failed' && <Badge variant="destructive">失败</Badge>}
                  {asset.processingStatus === 'pending' && <Badge variant="outline">待处理</Badge>}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">WebP转换</label>
                <p className="mt-1">
                  {asset.webpConverted ? (
                    <Badge variant="default">已转换</Badge>
                  ) : (
                    <Badge variant="outline">未转换</Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">上传时间</label>
                <p className="mt-1">{formatDate(asset.createdAt)}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">中文描述</label>
                <p className="mt-1">{asset.altTextZh || '无'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">英文描述</label>
                <p className="mt-1">{asset.altTextEn || '无'}</p>
              </div>
            </div>

            {/* URLs */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">图片链接</label>
              <div className="space-y-2">
                {[
                  { label: '原图', url: asset.fileUrl },
                  { label: '大图', url: asset.largeUrl },
                  { label: '中图', url: asset.mediumUrl },
                  { label: '小图', url: asset.smallUrl },
                  { label: '缩略图', url: asset.thumbnailUrl },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-sm w-16">{item.label}:</span>
                    <code className="flex-1 text-xs bg-muted px-2 py-1 rounded">
                      {item.url}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-4">
            {usagesLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">加载中...</p>
              </div>
            ) : usages && usages.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  此图片在以下 {usages.length} 个位置使用：
                </p>
                <div className="space-y-2">
                  {usages.map((usage) => (
                    <div
                      key={usage.id}
                      className="border rounded-lg p-3 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <Badge>{usage.usageType}</Badge>
                        <span className="text-sm font-medium">ID: {usage.usageId}</span>
                      </div>
                      {usage.fieldName && (
                        <p className="text-sm text-muted-foreground">
                          字段: {usage.fieldName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDate(usage.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">此图片暂未被使用</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
