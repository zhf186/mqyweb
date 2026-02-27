'use client'

import { memo } from 'react'
import Image from 'next/image'
import { Asset } from '@/lib/api/admin'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Eye, Trash2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssetGridProps {
  assets: Asset[]
  selectedIds: string[]
  onSelect: (ids: string[]) => void
  onReplace: (assetId: string, file: File) => Promise<void>
  onDelete: (ids: string[]) => Promise<void>
  onViewDetail: (asset: Asset) => void
}

/**
 * Asset Grid Component
 * 
 * Performance optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Uses Next.js Image component for automatic optimization and lazy loading
 * - Responsive grid layout
 */
const AssetGrid = memo(function AssetGrid({
  assets,
  selectedIds,
  onSelect,
  onReplace,
  onDelete,
  onViewDetail,
}: AssetGridProps) {
  const toggleSelect = (assetId: string) => {
    if (selectedIds.includes(assetId)) {
      onSelect(selectedIds.filter(id => id !== assetId))
    } else {
      onSelect([...selectedIds, assetId])
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === assets.length) {
      onSelect([])
    } else {
      onSelect(assets.map(a => a.id))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getStatusBadge = (asset: Asset) => {
    if (asset.processingStatus === 'completed') {
      return <Badge variant="default" className="text-xs">已处理</Badge>
    }
    if (asset.processingStatus === 'processing') {
      return <Badge variant="secondary" className="text-xs">处理中</Badge>
    }
    if (asset.processingStatus === 'failed') {
      return <Badge variant="destructive" className="text-xs">失败</Badge>
    }
    return <Badge variant="outline" className="text-xs">待处理</Badge>
  }

  return (
    <div className="space-y-4">
      {/* Select All */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedIds.length === assets.length && assets.length > 0}
          onCheckedChange={toggleSelectAll}
        />
        <span className="text-sm text-muted-foreground">全选</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={cn(
              'group relative border rounded-lg overflow-hidden transition-all hover:shadow-lg',
              selectedIds.includes(asset.id) && 'ring-2 ring-primary'
            )}
          >
            {/* Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedIds.includes(asset.id)}
                onCheckedChange={() => toggleSelect(asset.id)}
                className="bg-white"
              />
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 right-2 z-10">
              {getStatusBadge(asset)}
            </div>

            {/* Image - Using Next.js Image for optimization */}
            <div
              className="aspect-square bg-muted cursor-pointer relative"
              onClick={() => onViewDetail(asset)}
            >
              <Image
                src={asset.thumbnailUrl || asset.fileUrl}
                alt={asset.altTextZh || asset.originalFilename}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium truncate" title={asset.originalFilename}>
                {asset.originalFilename}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(asset.fileSize)}</span>
                <span className="hidden sm:inline">{asset.width} × {asset.height}</span>
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {formatDate(asset.createdAt)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 pt-1 sm:pt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 sm:h-8 px-2"
                  onClick={() => onViewDetail(asset)}
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 sm:h-8 px-2"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        onReplace(asset.id, file)
                      }
                    }
                    input.click()
                  }}
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 sm:h-8 px-2 text-red-500 hover:text-red-600"
                  onClick={() => onDelete([asset.id])}
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default AssetGrid
