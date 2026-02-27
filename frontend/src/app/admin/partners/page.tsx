'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partnerApi, Partner } from '@/lib/api/admin'
import { Button } from '@/components/ui/button'
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
import { Plus, Edit, Trash2, GripVertical, ExternalLink } from 'lucide-react'
import PartnerEditor from '@/components/admin/PartnerEditor'

export default function PartnersPage() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch partners
  const { data: partnersResponse, isLoading } = useQuery({
    queryKey: ['admin-partners'],
    queryFn: () => partnerApi.getPartners(),
  })

  const partners = partnersResponse?.data

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (partnerId: string) => partnerApi.deletePartner(partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] })
      toast({
        title: '删除成功',
        description: '合作伙伴已删除',
      })
      setIsDeleteDialogOpen(false)
      setPartnerToDelete(null)
    },
    onError: () => {
      toast({
        title: '删除失败',
        description: '无法删除合作伙伴，请稍后重试',
        variant: 'destructive',
      })
    },
  })

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: (partnerIds: string[]) => partnerApi.reorderPartners(partnerIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] })
      toast({
        title: '排序成功',
        description: '合作伙伴顺序已更新',
      })
    },
    onError: () => {
      toast({
        title: '排序失败',
        description: '无法更新排序，请稍后重试',
        variant: 'destructive',
      })
    },
  })

  const handleCreate = () => {
    setSelectedPartner(null)
    setIsEditorOpen(true)
  }

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner)
    setIsEditorOpen(true)
  }

  const handleDelete = (partner: Partner) => {
    setPartnerToDelete(partner)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (partnerToDelete) {
      deleteMutation.mutate(partnerToDelete.id)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index || !partners) return

    const newPartners = [...partners]
    const draggedPartner = newPartners[draggedIndex]
    newPartners.splice(draggedIndex, 1)
    newPartners.splice(index, 0, draggedPartner)

    // Update local state optimistically
    queryClient.setQueryData(['admin-partners'], (old: any) => ({
      ...old,
      data: newPartners
    }))
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    if (partners) {
      const partnerIds = partners.map((p) => p.id)
      reorderMutation.mutate(partnerIds)
    }
    setDraggedIndex(null)
  }

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      brand: '品牌合作',
      scenic_area: '景区合作',
    }
    return <Badge variant="outline">{labels[type] || type}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">合作伙伴管理</h1>
          <p className="text-muted-foreground mt-1">
            管理合作伙伴信息，支持拖拽排序
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          添加合作伙伴
        </Button>
      </div>

      {/* Partners Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>合作伙伴名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>网站</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : partners && partners.length > 0 ? (
              partners.map((partner, index) => (
                <TableRow
                  key={partner.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={draggedIndex === index ? 'opacity-50' : ''}
                >
                  <TableCell>
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{partner.name}</div>
                  </TableCell>
                  <TableCell>{getTypeBadge(partner.type)}</TableCell>
                  <TableCell>
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        访问网站
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={partner.isActive ? 'default' : 'secondary'}>
                      {partner.isActive ? '启用' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(partner.createdAt).toLocaleDateString('zh-CN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(partner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(partner)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  暂无合作伙伴数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Partner Editor Dialog */}
      <PartnerEditor
        partner={selectedPartner}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false)
          setSelectedPartner(null)
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-partners'] })
          setIsEditorOpen(false)
          setSelectedPartner(null)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除合作伙伴 "{partnerToDelete?.name}" 吗？此操作无法撤销。
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
