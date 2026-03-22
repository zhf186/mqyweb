'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { contentApi, type ContentItem, type Page } from '@/lib/api/admin'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ContentEditor } from '@/components/admin/ContentEditor'
import { ContentDiffPanel } from '@/components/admin/ContentDiffPanel'
import { VersionHistory } from '@/components/admin/VersionHistory'
import { PreviewModal } from '@/components/admin/PreviewModal'
import { PublishDialog } from '@/components/admin/PublishDialog'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, Clock, Eye, FileText, History, Upload } from 'lucide-react'

const PAGE_ZH_NAME_MAP: Record<string, string> = {
  home: '首页',
  ebike: 'E-BIKE页面',
  routes: '路线页面',
  goods: '在地好物',
  community: '社群活动',
  partners: '合作伙伴',
  about: '关于我们',
  'community-events': '社群活动子页',
  careers: '招贤纳士',
  contact: '联系我们',
  faq: '常见问题',
  privacy: '隐私政策',
  terms: '服务条款',
}

const hasChinese = (value?: string | null): boolean =>
  !!value && /[\u4e00-\u9fff]/.test(value)

const getPageZhName = (page: Page): string => {
  const mapped = PAGE_ZH_NAME_MAP[page.slug]
  if (mapped) return mapped
  if (hasChinese(page.nameZh)) return page.nameZh
  if (page.nameZh?.trim()) return page.nameZh
  return page.slug
}

const hasPendingDrafts = (items: ContentItem[]): boolean =>
  items.some((item) => item.hasUnpublishedChanges)

export default function ContentManagementPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [pages, setPages] = useState<Page[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string>('')
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [viewingHistoryItemId, setViewingHistoryItemId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showPublish, setShowPublish] = useState(false)

  useEffect(() => {
    loadPages()
  }, [])

  useEffect(() => {
    if (selectedPageId) {
      loadPageContent(selectedPageId)
    }
  }, [selectedPageId])

  const pageStatusLabel = useMemo(() => {
    if (contentItems.length === 0) {
      return null
    }

    return hasPendingDrafts(contentItems)
      ? { text: '有草稿未发布', className: 'bg-amber-100 text-amber-700' }
      : { text: '已全部发布', className: 'bg-emerald-100 text-emerald-700' }
  }, [contentItems])

  const loadPages = async () => {
    try {
      setLoading(true)
      const response = await contentApi.getPages()
      setPages(response.data)

      if (response.data.length > 0 && !selectedPageId) {
        setSelectedPageId(response.data[0].id)
      }
    } catch (error) {
      console.error('Failed to load pages:', error)
      toast({
        title: '加载失败',
        description: '无法加载页面列表，请刷新后重试。',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPageContent = async (pageId: string) => {
    try {
      setLoadingContent(true)
      const response = await contentApi.getPageContent(pageId)
      setSelectedPage(response.data.page)
      setContentItems(response.data.contentItems)
    } catch (error) {
      console.error('Failed to load page content:', error)
      toast({
        title: '加载失败',
        description: '无法加载页面内容，请稍后重试。',
        variant: 'destructive',
      })
    } finally {
      setLoadingContent(false)
    }
  }

  const handlePublish = async (summary: string) => {
    if (!selectedPageId) {
      throw new Error('请先选择要发布的页面')
    }

    await contentApi.publishPage(selectedPageId, summary)
    await loadPageContent(selectedPageId)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">内容管理</h1>
          <p className="mt-2 text-gray-600">管理网站页面中的可编辑内容。</p>
        </div>
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">内容管理</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">管理网站页面中的文案与草稿发布状态。</p>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <FileText className="h-5 w-5 text-gray-500 hidden sm:block" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择页面</label>
            <Select value={selectedPageId} onValueChange={setSelectedPageId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择要编辑的页面" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {getPageZhName(page)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPageId && contentItems.length > 0 && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none">
                <Eye className="h-4 w-4 mr-2" />
                快速预览
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedPage?.slug) {
                    router.push(`/admin/visual-editor/${selectedPage.slug}`)
                    return
                  }

                  const page = pages.find((currentPage) => currentPage.id === selectedPageId)
                  if (page?.slug) {
                    router.push(`/admin/visual-editor/${page.slug}`)
                  }
                }}
                className="flex-1 sm:flex-none"
              >
                <Eye className="h-4 w-4 mr-2" />
                可视化编辑
              </Button>
              <Button onClick={() => setShowPublish(true)} className="flex-1 sm:flex-none">
                <Upload className="h-4 w-4 mr-2" />
                发布
              </Button>
            </div>
          )}
        </div>

        {selectedPage && (
          <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">{selectedPage.description || '该页面暂无描述。'}</p>
            {pageStatusLabel && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2 py-1 rounded-full ${pageStatusLabel.className}`}>{pageStatusLabel.text}</span>
                <span className="text-gray-500">共 {contentItems.length} 项内容</span>
              </div>
            )}
          </div>
        )}
      </Card>

      {loadingContent ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : contentItems.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {contentItems.map((item) => (
            <Card key={item.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item.fieldKey}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded flex-shrink-0">{item.fieldType}</span>
                    {item.isRequired && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded flex-shrink-0">必填</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${item.hasUnpublishedChanges ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.hasUnpublishedChanges ? '草稿未发布' : '已发布'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">当前草稿 - 中文</p>
                      <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded break-words">
                        {item.contentZh || <span className="text-gray-400">未填写</span>}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">当前草稿 - English</p>
                      <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded break-words">
                        {item.contentEn || <span className="text-gray-400">Not filled</span>}
                      </p>
                    </div>

                    {item.hasUnpublishedChanges && (
                      <ContentDiffPanel
                        draftZh={item.contentZh}
                        draftEn={item.contentEn}
                        publishedZh={item.publishedContentZh}
                        publishedEn={item.publishedContentEn}
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">最后更新 {new Date(item.updatedAt).toLocaleString('zh-CN')}</span>
                    </div>
                    {item.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Upload className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">最近发布 {new Date(item.publishedAt).toLocaleString('zh-CN')}</span>
                      </div>
                    )}
                    {item.maxLength && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>最大长度 {item.maxLength}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingHistoryItemId(item.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <History className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">历史</span>
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(item)} className="flex-1 sm:flex-none">
                    编辑
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 sm:p-12 text-center">
          <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600">该页面暂时没有可编辑内容。</p>
        </Card>
      )}

      {editingItem && (
        <ContentEditor
          contentItem={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => {
            setEditingItem(null)
            if (selectedPageId) {
              loadPageContent(selectedPageId)
            }
          }}
        />
      )}

      {viewingHistoryItemId && (
        <VersionHistory
          contentItemId={viewingHistoryItemId}
          isOpen={!!viewingHistoryItemId}
          onClose={() => setViewingHistoryItemId(null)}
          onRestored={() => {
            setViewingHistoryItemId(null)
            if (selectedPageId) {
              loadPageContent(selectedPageId)
            }
          }}
        />
      )}

      {showPreview && selectedPage && (
        <PreviewModal
          contentItems={contentItems}
          pageName={getPageZhName(selectedPage)}
          pageSlug={selectedPage.slug}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onOpenVisualEditor={() => {
            router.push(`/admin/visual-editor/${selectedPage.slug}`)
          }}
        />
      )}

      {showPublish && selectedPage && (
        <PublishDialog
          pageName={getPageZhName(selectedPage)}
          isOpen={showPublish}
          onClose={() => setShowPublish(false)}
          onConfirm={handlePublish}
        />
      )}
    </div>
  )
}
