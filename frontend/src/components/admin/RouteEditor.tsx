'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { routeApi, Route, assetApi, type Asset } from '@/lib/api/admin'
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
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

const routeSchema = z.object({
  nameZh: z.string().min(1, '请输入中文名称').max(200, '名称不能超过200个字符'),
  nameEn: z.string().min(1, '请输入英文名称').max(200, '名称不能超过200个字符'),
  slug: z.string().min(1, '请输入URL标识').max(100, 'URL标识不能超过100个字符'),
  shortDescZh: z.string().max(500, '简短描述不能超过500个字符').optional(),
  shortDescEn: z.string().max(500, '简短描述不能超过500个字符').optional(),
  fullDescZh: z.string().optional(),
  fullDescEn: z.string().optional(),
  distance: z.number().min(0, '距离必须大于0'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.number().min(0, '时长必须大于0'),
  price: z.number().min(0, '价格必须大于0'),
  coverImageId: z.coerce.number().int().positive().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  isFeatured: z.boolean(),
})

type RouteFormData = z.infer<typeof routeSchema>

interface RouteEditorProps {
  route: Route | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function RouteEditor({
  route,
  isOpen,
  onClose,
  onSuccess,
}: RouteEditorProps) {
  const { toast } = useToast()

  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false)

  const form = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      nameZh: '',
      nameEn: '',
      slug: '',
      shortDescZh: '',
      shortDescEn: '',
      fullDescZh: '',
      fullDescEn: '',
      distance: 0,
      difficulty: 'medium',
      duration: 0,
      price: 0,
      coverImageId: undefined,
      status: 'draft',
      isFeatured: false,
    },
  })

  // Reset form when route changes
  useEffect(() => {
    if (route) {
      form.reset({
        nameZh: route.nameZh,
        nameEn: route.nameEn,
        slug: route.slug,
        shortDescZh: route.shortDescZh || '',
        shortDescEn: route.shortDescEn || '',
        fullDescZh: route.fullDescZh || '',
        fullDescEn: route.fullDescEn || '',
        distance: route.distance,
        difficulty: route.difficulty,
        duration: route.duration,
        price: route.price,
        coverImageId: route.coverImageId ? Number(route.coverImageId) : undefined,
        status: route.status,
        isFeatured: route.isFeatured,
      })
    } else {
      form.reset({
        nameZh: '',
        nameEn: '',
        slug: '',
        shortDescZh: '',
        shortDescEn: '',
        fullDescZh: '',
        fullDescEn: '',
        distance: 0,
        difficulty: 'medium',
        duration: 0,
        price: 0,
        coverImageId: undefined,
        status: 'draft',
        isFeatured: false,
      })
    }
  }, [route, form])

  const coverImageId = form.watch('coverImageId')
  const duration = form.watch('duration')
  const durationDays = duration && duration >= 24 ? Math.max(1, Math.round(duration / 24)) : 0
  const durationNights = durationDays > 0 ? Math.max(0, durationDays - 1) : 0

  const assetsQuery = useQuery({
    queryKey: ['admin-assets', 'route', isCoverPickerOpen],
    enabled: isCoverPickerOpen,
    queryFn: async () => {
      const res = await assetApi.getAssets({ category: 'route', page: 1, limit: 60 })
      return res.data.records
    },
  })

  const coverAssetQuery = useQuery({
    queryKey: ['admin-asset', coverImageId],
    enabled: !!coverImageId,
    queryFn: async () => {
      const res = await assetApi.getAsset(String(coverImageId))
      return res.data
    },
  })

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data: RouteFormData) => {
      const payload: any = {
        ...data,
        coverImageId: data.coverImageId === undefined ? undefined : String(data.coverImageId),
      }
      if (route) {
        return routeApi.updateRoute(route.id, payload)
      } else {
        return routeApi.createRoute(payload)
      }
    },
    onSuccess: () => {
      toast({
        title: route ? '更新成功' : '创建成功',
        description: route ? '路线已更新' : '路线已创建',
      })
      onSuccess()
    },
    onError: (error: any) => {
      toast({
        title: route ? '更新失败' : '创建失败',
        description: error.message || '操作失败，请稍后重试',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: RouteFormData) => {
    saveMutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{route ? '编辑路线' : '创建路线'}</DialogTitle>
          <DialogDescription>
            {route ? '修改路线信息' : '填写路线基本信息'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="description">详细描述</TabsTrigger>
                <TabsTrigger value="settings">设置</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {/* Chinese Name */}
                <FormField
                  control={form.control}
                  name="nameZh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>中文名称 *</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：西湖环湖骑行" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* English Name */}
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>英文名称 *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., West Lake Cycling Tour" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL标识 *</FormLabel>
                      <FormControl>
                        <Input placeholder="west-lake-cycling" {...field} />
                      </FormControl>
                      <FormDescription>
                        用于URL，只能包含小写字母、数字和连字符
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Distance */}
                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>距离 (km) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Duration */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>时长 (小时) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        {durationDays > 0 ? <FormDescription>{`约 ${durationDays} 天 ${durationNights} 夜`}</FormDescription> : null}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Difficulty */}
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>难度 *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择难度" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">简单</SelectItem>
                            <SelectItem value="medium">中等</SelectItem>
                            <SelectItem value="hard">困难</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>价格 (¥) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="coverImageId"
                  render={() => (
                    <FormItem>
                      <FormLabel>封面图片</FormLabel>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsCoverPickerOpen(true)}>
                            从资源库选择
                          </Button>
                          {coverImageId ? (
                            <span className="text-sm text-muted-foreground">已选择：{coverImageId}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">未选择</span>
                          )}
                        </div>
                        {coverAssetQuery.data ? (
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted">
                            <Image
                              src={coverAssetQuery.data.thumbnailUrl || coverAssetQuery.data.fileUrl}
                              alt={coverAssetQuery.data.altTextZh || coverAssetQuery.data.originalFilename}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 600px"
                            />
                          </div>
                        ) : null}
                      </div>
                      <FormDescription>
                        选择后将用于官网路线列表与详情页展示。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="description" className="space-y-4">
                {/* Short Description Chinese */}
                <FormField
                  control={form.control}
                  name="shortDescZh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>简短描述（中文）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="简短介绍路线特色..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 500 字符
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Short Description English */}
                <FormField
                  control={form.control}
                  name="shortDescEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>简短描述（英文）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief introduction to the route..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Description Chinese */}
                <FormField
                  control={form.control}
                  name="fullDescZh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>详细描述（中文）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="详细介绍路线的景点、特色、注意事项等..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Description English */}
                <FormField
                  control={form.control}
                  name="fullDescEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>详细描述（英文）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of attractions, features, notes..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>状态</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择状态" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">草稿</SelectItem>
                          <SelectItem value="published">已发布</SelectItem>
                          <SelectItem value="archived">已下架</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Is Featured */}
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">精选路线</FormLabel>
                        <FormDescription>
                          在首页展示此路线
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

        <Dialog open={isCoverPickerOpen} onOpenChange={setIsCoverPickerOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>选择封面图片</DialogTitle>
              <DialogDescription>从资源库（route 分类）选择一张图片作为路线封面</DialogDescription>
            </DialogHeader>

            {assetsQuery.isLoading ? (
              <div className="py-10 text-center text-muted-foreground">加载中...</div>
            ) : assetsQuery.isError ? (
              <div className="py-10 text-center text-muted-foreground">加载失败，请稍后重试</div>
            ) : (assetsQuery.data?.length ?? 0) === 0 ? (
              <div className="py-10 text-center text-muted-foreground">资源库暂无 route 分类图片</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {(assetsQuery.data as Asset[]).map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      form.setValue('coverImageId', Number(asset.id), { shouldDirty: true, shouldValidate: true })
                      setIsCoverPickerOpen(false)
                    }}
                    className="group relative overflow-hidden rounded-lg border bg-muted text-left"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={asset.thumbnailUrl || asset.fileUrl}
                        alt={asset.altTextZh || asset.originalFilename}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      />
                    </div>
                    <div className="p-2">
                      <div className="truncate text-xs text-muted-foreground">ID: {asset.id}</div>
                      <div className="truncate text-sm font-medium">{asset.originalFilename}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
