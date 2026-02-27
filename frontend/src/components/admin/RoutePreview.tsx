'use client'

import { Route } from '@/lib/api/admin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Clock, TrendingUp, DollarSign, Star } from 'lucide-react'

interface RoutePreviewProps {
  route: Route | null
  isOpen: boolean
  onClose: () => void
}

export default function RoutePreview({
  route,
  isOpen,
  onClose,
}: RoutePreviewProps) {
  if (!route) return null

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: '简单',
      medium: '中等',
      hard: '困难',
    }
    return labels[difficulty] || difficulty
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '草稿',
      published: '已发布',
      archived: '已下架',
    }
    return labels[status] || status
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>路线预览</DialogTitle>
          <DialogDescription>
            查看路线的详细信息和展示效果
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{route.nameZh}</h2>
              {route.isFeatured && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  精选
                </Badge>
              )}
              <Badge variant="outline">{getStatusLabel(route.status)}</Badge>
            </div>
            <p className="text-muted-foreground">{route.nameEn}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">距离</div>
                <div className="font-semibold">{route.distance} km</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">时长</div>
                <div className="font-semibold">
                  {route.duration >= 24
                    ? `${Math.round(route.duration / 24)}天${Math.max(0, Math.round(route.duration / 24) - 1)}夜`
                    : `${route.duration}小时`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">难度</div>
                <div className="font-semibold">
                  {getDifficultyLabel(route.difficulty)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">价格</div>
                <div className="font-semibold">¥{route.price}</div>
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
              {route.shortDescZh && (
                <div>
                  <h3 className="font-semibold mb-2">简短描述</h3>
                  <p className="text-muted-foreground">{route.shortDescZh}</p>
                </div>
              )}
              {route.fullDescZh && (
                <div>
                  <h3 className="font-semibold mb-2">详细描述</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{route.fullDescZh}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              {route.shortDescEn && (
                <div>
                  <h3 className="font-semibold mb-2">Short Description</h3>
                  <p className="text-muted-foreground">{route.shortDescEn}</p>
                </div>
              )}
              {route.fullDescEn && (
                <div>
                  <h3 className="font-semibold mb-2">Full Description</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{route.fullDescEn}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Metadata */}
          <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>URL标识:</span>
              <span className="font-mono">{route.slug}</span>
            </div>
            <div className="flex justify-between">
              <span>浏览次数:</span>
              <span>{route.viewCount}</span>
            </div>
            <div className="flex justify-between">
              <span>预订次数:</span>
              <span>{route.bookingCount}</span>
            </div>
            <div className="flex justify-between">
              <span>创建时间:</span>
              <span>{new Date(route.createdAt).toLocaleString('zh-CN')}</span>
            </div>
            <div className="flex justify-between">
              <span>更新时间:</span>
              <span>{new Date(route.updatedAt).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
