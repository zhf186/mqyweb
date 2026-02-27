'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { productApi, Product } from '@/lib/api/admin'
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

const productSchema = z.object({
  nameZh: z.string().min(1, '请输入中文名称').max(200, '名称不能超过200个字符'),
  nameEn: z.string().min(1, '请输入英文名称').max(200, '名称不能超过200个字符'),
  slug: z.string().min(1, '请输入URL标识').max(100, 'URL标识不能超过100个字符'),
  shortDescZh: z.string().max(500, '简短描述不能超过500个字符').optional(),
  shortDescEn: z.string().max(500, '简短描述不能超过500个字符').optional(),
  fullDescZh: z.string().optional(),
  fullDescEn: z.string().optional(),
  category: z.string().min(1, '请选择分类'),
  originalPrice: z.number().min(0, '价格必须大于0'),
  currentPrice: z.number().min(0, '价格必须大于0'),
  stockQuantity: z.number().min(0, '库存必须大于等于0'),
  merchantName: z.string().max(200, '商家名称不能超过200个字符').optional(),
  merchantAddress: z.string().max(500, '商家地址不能超过500个字符').optional(),
  merchantContact: z.string().max(100, '联系方式不能超过100个字符').optional(),
  status: z.enum(['draft', 'active', 'inactive']),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductEditorProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ProductEditor({
  product,
  isOpen,
  onClose,
  onSuccess,
}: ProductEditorProps) {
  const { toast } = useToast()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameZh: '',
      nameEn: '',
      slug: '',
      shortDescZh: '',
      shortDescEn: '',
      fullDescZh: '',
      fullDescEn: '',
      category: '',
      originalPrice: 0,
      currentPrice: 0,
      stockQuantity: 0,
      merchantName: '',
      merchantAddress: '',
      merchantContact: '',
      status: 'draft',
    },
  })

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        nameZh: product.nameZh,
        nameEn: product.nameEn,
        slug: product.slug,
        shortDescZh: product.shortDescZh || '',
        shortDescEn: product.shortDescEn || '',
        fullDescZh: product.fullDescZh || '',
        fullDescEn: product.fullDescEn || '',
        category: product.category,
        originalPrice: product.originalPrice,
        currentPrice: product.currentPrice,
        stockQuantity: product.stockQuantity,
        merchantName: product.merchantName || '',
        merchantAddress: product.merchantAddress || '',
        merchantContact: product.merchantContact || '',
        status: product.status,
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
        category: '',
        originalPrice: 0,
        currentPrice: 0,
        stockQuantity: 0,
        merchantName: '',
        merchantAddress: '',
        merchantContact: '',
        status: 'draft',
      })
    }
  }, [product, form])

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      if (product) {
        return productApi.updateProduct(product.id, data)
      } else {
        return productApi.createProduct(data)
      }
    },
    onSuccess: () => {
      toast({
        title: product ? '更新成功' : '创建成功',
        description: product ? '商品已更新' : '商品已创建',
      })
      onSuccess()
    },
    onError: (error: any) => {
      toast({
        title: product ? '更新失败' : '创建失败',
        description: error.message || '操作失败，请稍后重试',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: ProductFormData) => {
    saveMutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? '编辑商品' : '创建商品'}</DialogTitle>
          <DialogDescription>
            {product ? '修改商品信息' : '填写商品基本信息'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="description">详细描述</TabsTrigger>
                <TabsTrigger value="merchant">商家信息</TabsTrigger>
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
                        <Input placeholder="例如：手工陶瓷茶具" {...field} />
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
                        <Input placeholder="e.g., Handmade Ceramic Tea Set" {...field} />
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
                        <Input placeholder="ceramic-tea-set" {...field} />
                      </FormControl>
                      <FormDescription>
                        用于URL，只能包含小写字母、数字和连字符
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>分类 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择分类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="衣">衣</SelectItem>
                          <SelectItem value="食">食</SelectItem>
                          <SelectItem value="住">住</SelectItem>
                          <SelectItem value="行">行</SelectItem>
                          <SelectItem value="乐">乐</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  {/* Original Price */}
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>原价 (¥) *</FormLabel>
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

                  {/* Current Price */}
                  <FormField
                    control={form.control}
                    name="currentPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>现价 (¥) *</FormLabel>
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

                  {/* Stock Quantity */}
                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>库存 *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          <SelectItem value="active">上架</SelectItem>
                          <SelectItem value="inactive">下架</SelectItem>
                        </SelectContent>
                      </Select>
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
                          placeholder="简短介绍商品特色..."
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
                          placeholder="Brief introduction to the product..."
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
                          placeholder="详细介绍商品的材质、工艺、使用方法等..."
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
                          placeholder="Detailed description of materials, craftsmanship, usage..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="merchant" className="space-y-4">
                {/* Merchant Name */}
                <FormField
                  control={form.control}
                  name="merchantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>商家名称</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：老李茶具店" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Merchant Address */}
                <FormField
                  control={form.control}
                  name="merchantAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>商家地址</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：杭州市西湖区..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Merchant Contact */}
                <FormField
                  control={form.control}
                  name="merchantContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>联系方式</FormLabel>
                      <FormControl>
                        <Input placeholder="电话或微信" {...field} />
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
