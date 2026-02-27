'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routeApi, Route } from '@/lib/api/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Search, Edit, Trash2, Eye, CheckCircle } from 'lucide-react'
import RouteEditor from '@/components/admin/RouteEditor'
import RoutePreview from '@/components/admin/RoutePreview'

export default function RoutesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch routes
  const { data: routesData, isLoading } = useQuery({
    queryKey: ['admin-routes', statusFilter, search, page],
    queryFn: () =>
      routeApi.getRoutes({
        status: statusFilter === 'all' ? undefined : (statusFilter as any),
        search: search || undefined,
        page,
        limit: 20,
      }),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (routeId: string) => routeApi.deleteRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routes'] })
      toast({
        title: '删除成功',
        description: '路线已删除',
      })
      setIsDeleteDialogOpen(false)
      setRouteToDelete(null)
    },
    onError: () => {
      toast({
        title: '删除失败',
        description: '无法删除路线，请稍后重试',
        variant: 'destructive',
      })
    },
  })

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: (routeId: string) => routeApi.publishRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routes'] })
      toast({
        title: '发布成功',
        description: '路线已发布',
      })
    },
    onError: () => {
      toast({
        title: '发布失败',
        description: '无法发布路线，请稍后重试',
        variant: 'destructive',
      })
    },
  })

  const handleCreate = () => {
    setSelectedRoute(null)
    setIsEditorOpen(true)
  }

  const handleEdit = (route: Route) => {
    setSelectedRoute(route)
    setIsEditorOpen(true)
  }

  const handlePreview = (route: Route) => {
    setSelectedRoute(route)
    setIsPreviewOpen(true)
  }

  const handleDelete = (route: Route) => {
    setRouteToDelete(route)
    setIsDeleteDialogOpen(true)
  }

  const handlePublish = (route: Route) => {
    publishMutation.mutate(route.id)
  }

  const confirmDelete = () => {
    if (routeToDelete) {
      deleteMutation.mutate(routeToDelete.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      draft: 'secondary',
      published: 'default',
      archived: 'destructive',
    }
    const labels: Record<string, string> = {
      draft: '草稿',
      published: '已发布',
      archived: '已下架',
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    )
  }

  const getDifficultyBadge = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: '简单',
      medium: '中等',
      hard: '困难',
    }
    return <Badge variant="outline">{labels[difficulty] || difficulty}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">路线管理</h1>
          <p className="text-muted-foreground mt-1">
            管理骑游路线的详细信息
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          创建路线
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索路线名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
            <SelectItem value="archived">已下架</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Routes Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>路线名称</TableHead>
              <TableHead>难度</TableHead>
              <TableHead>距离</TableHead>
              <TableHead>价格</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>浏览/预订</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : routesData?.data?.records && routesData.data.records.length > 0 ? (
              routesData.data.records.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{route.nameZh}</div>
                      <div className="text-sm text-muted-foreground">
                        {route.nameEn}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getDifficultyBadge(route.difficulty)}</TableCell>
                  <TableCell>{route.distance} km</TableCell>
                  <TableCell>¥{route.price}</TableCell>
                  <TableCell>{getStatusBadge(route.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{route.viewCount} 浏览</div>
                      <div className="text-muted-foreground">
                        {route.bookingCount} 预订
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(route.updatedAt).toLocaleDateString('zh-CN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(route)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(route)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {route.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(route)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(route)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  暂无路线数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {routesData?.data && routesData.data.total > 20 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <div className="flex items-center px-4">
            第 {page} 页，共 {Math.ceil(routesData.data.total / 20)} 页
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(routesData.data.total / 20)}
          >
            下一页
          </Button>
        </div>
      )}

      {/* Route Editor Dialog */}
      <RouteEditor
        route={selectedRoute}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false)
          setSelectedRoute(null)
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-routes'] })
          setIsEditorOpen(false)
          setSelectedRoute(null)
        }}
      />

      {/* Route Preview Dialog */}
      <RoutePreview
        route={selectedRoute}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setSelectedRoute(null)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除路线 "{routeToDelete?.nameZh}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
