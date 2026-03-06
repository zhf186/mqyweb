'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assetApi, Asset } from '@/lib/api/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAdminAuthStore } from '@/stores/admin-auth'
import { Upload, Search, Filter, Trash2, RefreshCw } from 'lucide-react'
import AssetGrid from '@/components/admin/AssetGrid'
import AssetUploader from '@/components/admin/AssetUploader'
import AssetDetail from '@/components/admin/AssetDetail'

const CATEGORIES = [
  { value: 'all', label: '全部分类' },
  { value: 'home', label: '首页' },
  { value: 'about', label: '关于我们' },
  { value: 'ebike', label: 'E-BIKE 页面' },
  { value: 'routes', label: '骑行路线' },
  { value: 'goods', label: '在地好物' },
  { value: 'community', label: '社群活动' },
  { value: 'partners', label: '合作伙伴' },
]

export default function AssetsPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [showUploader, setShowUploader] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const hasHydrated = useAdminAuthStore((state) => state.hasHydrated)
  const token = useAdminAuthStore((state) => state.token)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['assets', category, search, page, token],
    queryFn: () =>
      assetApi.getAssets({
        category: category === 'all' ? undefined : category,
        search: search || undefined,
        page,
        limit: 20,
      }),
    enabled: hasHydrated && !!token,
  })

  const data = response?.data
  const errorMessage = error instanceof Error ? error.message : '加载失败，请稍后重试'

  const deleteMutation = useMutation({
    mutationFn: (assetId: string) => assetApi.deleteAsset(assetId),
    onSuccess: () => {
      toast({
        title: '删除成功',
        description: '图片已成功删除',
      })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      setSelectedAssets([])
    },
    onError: (err: unknown) => {
      toast({
        title: '删除失败',
        description: err instanceof Error ? err.message : '删除图片时出错',
        variant: 'destructive',
      })
    },
  })

  const handleDelete = async (assetIds: string[]) => {
    if (!confirm(`确定要删除 ${assetIds.length} 张图片吗？`)) {
      return
    }

    for (const id of assetIds) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const handleUploadComplete = (uploadedCategory: string) => {
    setShowUploader(false)
    setPage(1)
    if (category !== 'all' && category !== uploadedCategory) {
      setCategory(uploadedCategory)
    }
    queryClient.invalidateQueries({ queryKey: ['assets'] })
    toast({
      title: '上传成功',
      description: '图片已成功上传并处理',
    })
  }

  const handleReplace = async (assetId: string, file: File) => {
    try {
      await assetApi.replaceAsset(assetId, file)
      toast({
        title: '替换成功',
        description: '图片已成功替换',
      })
      refetch()
    } catch (err: unknown) {
      toast({
        title: '替换失败',
        description: err instanceof Error ? err.message : '替换图片时出错',
        variant: 'destructive',
      })
    }
  }

  if (!hasHydrated || (hasHydrated && !!token && isLoading)) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground text-sm">加载中...</p>
        </div>
      </div>
    )
  }

  if (hasHydrated && !token) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-12 text-muted-foreground text-sm">登录状态校验中...</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">图片管理</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">管理网站图片资源，支持上传、替换和删除</p>
        </div>
        <Button onClick={() => setShowUploader(true)} className="w-full sm:w-auto">
          <Upload className="w-4 h-4 mr-2" />
          上传图片
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索图片..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => refetch()} className="w-full sm:w-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      {selectedAssets.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">已选择 {selectedAssets.length} 张图片</span>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(selectedAssets)}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              删除选中
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAssets([])}
              className="flex-1 sm:flex-none"
            >
              取消选择
            </Button>
          </div>
        </div>
      )}

      {isError ? (
        <div className="text-center py-12">
          <p className="text-red-600 text-sm sm:text-base">图片加载失败：{errorMessage}</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重试
          </Button>
        </div>
      ) : data && data.records && data.records.length > 0 ? (
        <>
          <AssetGrid
            assets={data.records}
            selectedIds={selectedAssets}
            onSelect={setSelectedAssets}
            onReplace={handleReplace}
            onDelete={(ids) => handleDelete(ids)}
            onViewDetail={setSelectedAsset}
          />

          {data.total > 20 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="w-full sm:w-auto"
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground">
                第 {page} 页，共 {Math.ceil(data.total / 20)} 页
              </span>
              <Button
                variant="outline"
                disabled={page >= Math.ceil(data.total / 20)}
                onClick={() => setPage(page + 1)}
                className="w-full sm:w-auto"
              >
                下一页
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm sm:text-base">暂无图片</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowUploader(true)}>
            <Upload className="w-4 h-4 mr-2" />
            上传第一张图片
          </Button>
        </div>
      )}

      {showUploader && (
        <AssetUploader
          category={category === 'all' ? 'home' : category}
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploader(false)}
        />
      )}

      {selectedAsset && (
        <AssetDetail
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onReplace={handleReplace}
          onDelete={(id) => {
            handleDelete([id])
            setSelectedAsset(null)
          }}
        />
      )}
    </div>
  )
}
