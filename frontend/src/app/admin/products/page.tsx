'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, Product } from '@/lib/api/admin'
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
import { Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react'
import ProductEditor from '@/components/admin/ProductEditor'
import ProductPreview from '@/components/admin/ProductPreview'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', statusFilter, categoryFilter, search, page],
    queryFn: () =>
      productApi.getProducts({
        status: statusFilter === 'all' ? undefined : (statusFilter as any),
        search: search || undefined,
        page,
        limit: 20,
      }),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast({ title: '删除成功', description: '商品已删除' })
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    },
    onError: () => {
      toast({ title: '删除失败', description: '无法删除商品，请稍后重试', variant: 'destructive' })
    },
  })

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ productId, newStatus }: { productId: string; newStatus: string }) =>
      productApi.updateProduct(productId, { status: newStatus } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast({ title: '状态更新成功' })
    },
    onError: () => {
      toast({ title: '状态更新失败', variant: 'destructive' })
    },
  })

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsEditorOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsEditorOpen(true)
  }

  const handlePreview = (product: Product) => {
    setSelectedProduct(product)
    setIsPreviewOpen(true)
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const handleToggleStatus = (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    toggleStatusMutation.mutate({ productId: product.id, newStatus })
  }

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      draft: 'secondary',
      active: 'default',
      inactive: 'destructive',
    }
    const labels: Record<string, string> = {
      draft: '草稿',
      active: '上架',
      inactive: '下架',
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    )
  }

  // Filter by category on the client side (backend also supports it)
  const filteredRecords = productsData?.data?.records?.filter((p) =>
    categoryFilter === 'all' ? true : p.category === categoryFilter
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">商品管理</h1>
          <p className="text-muted-foreground mt-1">管理在地好物商品信息</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          创建商品
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索商品名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="筛选分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            <SelectItem value="衣">衣</SelectItem>
            <SelectItem value="食">食</SelectItem>
            <SelectItem value="住">住</SelectItem>
            <SelectItem value="行">行</SelectItem>
            <SelectItem value="乐">乐</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="active">上架</SelectItem>
            <SelectItem value="inactive">下架</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>商品名称</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>价格</TableHead>
              <TableHead>库存</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>浏览/销售</TableHead>
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
            ) : filteredRecords && filteredRecords.length > 0 ? (
              filteredRecords.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.nameZh}</div>
                      <div className="text-sm text-muted-foreground">{product.nameEn}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">¥{product.currentPrice}</div>
                      {product.originalPrice !== product.currentPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ¥{product.originalPrice}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{product.viewCount} 浏览</div>
                      <div className="text-muted-foreground">{product.saleCount} 销售</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(product.updatedAt).toLocaleDateString('zh-CN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(product)} title="预览">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} title="编辑">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {product.status !== 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(product)}
                          title={product.status === 'active' ? '下架' : '上架'}
                        >
                          {product.status === 'active' ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {product.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(product)}
                          title="上架"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product)} title="删除">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  暂无商品数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {productsData?.data && productsData.data.total > 20 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <div className="flex items-center px-4">
            第 {page} 页，共 {Math.ceil(productsData.data.total / 20)} 页
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(productsData.data.total / 20)}
          >
            下一页
          </Button>
        </div>
      )}

      {/* Product Editor Dialog */}
      <ProductEditor
        product={selectedProduct}
        isOpen={isEditorOpen}
        onClose={() => { setIsEditorOpen(false); setSelectedProduct(null) }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-products'] })
          setIsEditorOpen(false)
          setSelectedProduct(null)
        }}
      />

      {/* Product Preview Dialog */}
      <ProductPreview
        product={selectedProduct}
        isOpen={isPreviewOpen}
        onClose={() => { setIsPreviewOpen(false); setSelectedProduct(null) }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除商品 &quot;{productToDelete?.nameZh}&quot; 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
