'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { partnerApi, Partner } from '@/lib/api/admin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

const partnerSchema = z.object({
  name: z.string().min(1, '请输入合作伙伴名称').max(200, '名称不能超过200个字符'),
  type: z.enum(['brand', 'scenic_area']),
  descriptionZh: z.string().optional(),
  descriptionEn: z.string().optional(),
  websiteUrl: z.string().url('请输入有效的URL').or(z.literal('')).optional(),
  isActive: z.boolean(),
})

type PartnerFormData = z.infer<typeof partnerSchema>

interface PartnerEditorProps {
  partner: Partner | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function PartnerEditor({
  partner,
  isOpen,
  onClose,
  onSuccess,
}: PartnerEditorProps) {
  const { toast } = useToast()

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: '',
      type: 'brand',
      descriptionZh: '',
      descriptionEn: '',
      websiteUrl: '',
      isActive: true,
    },
  })

  // Reset form when partner changes
  useEffect(() => {
    if (partner) {
      form.reset({
        name: partner.name,
        type: partner.type,
        descriptionZh: partner.descriptionZh || '',
        descriptionEn: partner.descriptionEn || '',
        websiteUrl: partner.websiteUrl || '',
        isActive: partner.isActive,
      })
    } else {
      form.reset({
        name: '',
        type: 'brand',
        descriptionZh: '',
        descriptionEn: '',
        websiteUrl: '',
        isActive: true,
      })
    }
  }, [partner, form])

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data: PartnerFormData) => {
      if (partner) {
        return partnerApi.updatePartner(partner.id, data)
      } else {
        return partnerApi.createPartner(data)
      }
    },
    onSuccess: () => {
      toast({
        title: partner ? '更新成功' : '创建成功',
        description: partner ? '合作伙伴已更新' : '合作伙伴已创建',
      })
      onSuccess()
    },
    onError: (error: any) => {
      toast({
        title: partner ? '更新失败' : '创建失败',
        description: error.message || '操作失败，请稍后重试',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: PartnerFormData) => {
    saveMutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{partner ? '编辑合作伙伴' : '添加合作伙伴'}</DialogTitle>
          <DialogDescription>
            {partner ? '修改合作伙伴信息' : '填写合作伙伴基本信息'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="description">详细描述</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>合作伙伴名称 *</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：途尔电动车" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>合作类型 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择合作类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="brand">品牌合作</SelectItem>
                          <SelectItem value="scenic_area">景区合作</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website URL */}
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>官网链接</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        合作伙伴的官方网站地址
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Is Active */}
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">启用状态</FormLabel>
                        <FormDescription>
                          是否在网站上显示此合作伙伴
                        </FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="description" className="space-y-4">
                {/* Description Chinese */}
                <FormField
                  control={form.control}
                  name="descriptionZh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>合作描述（中文）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="介绍合作内容、合作亮点等..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description English */}
                <FormField
                  control={form.control}
                  name="descriptionEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>合作描述（英文）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Partnership description, highlights..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
