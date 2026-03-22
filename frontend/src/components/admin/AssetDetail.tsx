'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Asset, assetApi } from '@/lib/api/admin'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, RefreshCw, Trash2, ExternalLink, AlertTriangle } from 'lucide-react'

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

  const { data: usagesResponse, isLoading: usagesLoading } = useQuery({
    queryKey: ['asset-usage', asset.id],
    queryFn: () => assetApi.getAssetUsage(asset.id),
  })

  const usages = usagesResponse?.data ?? []

  const formatFileSize = (bytes?: number | string | null) => {
    const size = Number(bytes)
    if (!Number.isFinite(size) || size <= 0) return '--'
    if (size < 1024) return `${Math.round(size)} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(1)} MB`
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
      case 'large':
        return asset.largeUrl
      case 'medium':
        return asset.mediumUrl
      case 'small':
        return asset.smallUrl
      case 'thumbnail':
        return asset.thumbnailUrl
      default:
        return asset.fileUrl
    }
  }

  const handleReplace = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return
      await onReplace(asset.id, file)
      onClose()
    }
    input.click()
  }

  const handleDelete = () => {
    const message = usages.length > 0
      ? `该图片正在 ${usages.length} 个位置使用，删除后相关内容将无法显示图片。确认删除吗？`
      : '确认删除这张图片吗？'

    if (!confirm(message)) {
      return
    }

    onDelete(asset.id)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = getSizeUrl()
    link.download = asset.originalFilename
    link.click()
  }

  const getStatusBadge = () => {
    if (asset.processingStatus === 'completed') {
      return <Badge variant="default">已处理</Badge>
    }
    if (asset.processingStatus === 'processing') {
      return <Badge variant="secondary">处理中</Badge>
    }
    if (asset.processingStatus === 'failed') {
      return <Badge variant="destructive">失败</Badge>
    }
    return <Badge variant="outline">待处理</Badge>
  }

  const previewUrl = getSizeUrl()
  const previewWidth = asset.width && asset.width > 0 ? asset.width : 1200
  const previewHeight = asset.height && asset.height > 0 ? asset.height : 800

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>图片详情</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="info">信息</TabsTrigger>
            <TabsTrigger value="usage">使用情况</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
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
                    onClick={() => setSelectedSize(size.key as typeof selectedSize)}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-muted">
              <div
                className="relative w-full"
                style={{ aspectRatio: `${previewWidth} / ${previewHeight}` }}
              >
                <Image
                  key={previewUrl}
                  src={previewUrl}
                  alt={asset.altTextZh || asset.originalFilename}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 960px"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                下载
              </Button>
              <Button variant="outline" onClick={handleReplace}>
                <RefreshCw className="mr-2 h-4 w-4" />
                替换
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={usages.length > 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </Button>
              {usages.length > 0 && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  图片正在使用中
                </span>
              )}
            </div>
          </TabsContent>

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
                <p className="mt-1">{getStatusBadge()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">优化输出</label>
                <p className="mt-1">
                  {asset.webpConverted ? (
                    <Badge variant="default">已优化</Badge>
                  ) : (
                    <Badge variant="outline">未优化</Badge>
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
                    <span className="w-16 text-sm">{item.label}:</span>
                    <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">
                      {item.url}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            {usagesLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                <p className="mt-2 text-muted-foreground">加载中...</p>
              </div>
            ) : usages.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  该图片在以下 {usages.length} 个位置被使用:
                </p>
                <div className="space-y-2">
                  {usages.map((usage) => (
                    <div key={usage.id} className="space-y-1 rounded-lg border p-3">
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
              <div className="py-8 text-center">
                <p className="text-muted-foreground">该图片当前未被使用</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
