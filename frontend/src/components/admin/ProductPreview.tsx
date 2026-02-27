'use client'

import { Product } from '@/lib/api/admin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, DollarSign, Store, Tag } from 'lucide-react'

interface ProductPreviewProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductPreview({
  product,
  isOpen,
  onClose,
}: ProductPreviewProps) {
  if (!product) return null

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '草稿',
      active: '上架',
      inactive: '下架',
    }
    return labels[status] || status
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>商品预览</DialogTitle>
          <DialogDescription>查看商品的详细信息</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{product.nameZh}</h2>
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="outline">{getStatusLabel(product.status)}</Badge>
            </div>
            <p className="text-muted-foreground">{product.nameEn}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">现价</div>
                <div className="font-semibold">¥{product.currentPrice}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">原价</div>
                <div className="font-semibold">¥{product.originalPrice}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">库存</div>
                <div className="font-semibold">{product.stockQuantity}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Store className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">商家</div>
                <div className="font-semibold truncate">{product.merchantName || '未设置'}</div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="zh" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="zh">中文</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>

            <TabsContent value="zh" className="space-y-4">
              {product.shortDescZh && (
                <div>
                  <h3 className="font-semibold mb-2">简短描述</h3>
                  <p className="text-muted-foreground">{product.shortDescZh}</p>
                </div>
              )}
              {product.fullDescZh && (
                <div>
                  <h3 className="font-semibold mb-2">详细描述</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{product.fullDescZh}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              {product.shortDescEn && (
                <div>
                  <h3 className="font-semibold mb-2">Short Description</h3>
                  <p className="text-muted-foreground">{product.shortDescEn}</p>
                </div>
              )}
              {product.fullDescEn && (
                <div>
                  <h3 className="font-semibold mb-2">Full Description</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{product.fullDescEn}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Merchant Info */}
          {(product.merchantName || product.merchantAddress || product.merchantContact) && (
            <div className="border-t pt-4 space-y-2">
              <h3 className="font-semibold">商家信息</h3>
              {product.merchantName && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">商家名称:</span>
                  <span>{product.merchantName}</span>
                </div>
              )}
              {product.merchantAddress && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">商家地址:</span>
                  <span>{product.merchantAddress}</span>
                </div>
              )}
              {product.merchantContact && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">联系方式:</span>
                  <span>{product.merchantContact}</span>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>URL标识:</span>
              <span className="font-mono">{product.slug}</span>
            </div>
            <div className="flex justify-between">
              <span>浏览次数:</span>
              <span>{product.viewCount}</span>
            </div>
            <div className="flex justify-between">
              <span>销售次数:</span>
              <span>{product.saleCount}</span>
            </div>
            <div className="flex justify-between">
              <span>创建时间:</span>
              <span>{new Date(product.createdAt).toLocaleString('zh-CN')}</span>
            </div>
            <div className="flex justify-between">
              <span>更新时间:</span>
              <span>{new Date(product.updatedAt).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
