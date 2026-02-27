'use client'

import { type ContentItem } from '@/lib/api/admin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, ExternalLink } from 'lucide-react'

interface PreviewModalProps {
  contentItems: ContentItem[]
  pageName: string
  pageSlug: string
  isOpen: boolean
  onClose: () => void
  onOpenVisualEditor?: () => void
}

/**
 * 预览模态框组件
 * Requirements: 5.2, 5.5, 5.6
 */
export function PreviewModal({
  contentItems,
  pageName,
  pageSlug,
  isOpen,
  onClose,
  onOpenVisualEditor,
}: PreviewModalProps) {
  const contentMap = contentItems.reduce((acc, item) => {
    acc[item.fieldKey] = {
      zh: item.contentZh,
      en: item.contentEn,
    }
    return acc
  }, {} as Record<string, { zh: string; en: string }>)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            内容预览 - {pageName}
          </DialogTitle>
          <DialogDescription>
            这是预览模式，内容尚未发布到正式网站
          </DialogDescription>
        </DialogHeader>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ⚠️ 预览模式：此处显示的是编辑后的内容，尚未应用到正式网站
          </p>
        </div>

        <Tabs defaultValue="zh" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="zh">中文预览</TabsTrigger>
            <TabsTrigger value="en">English Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="zh" className="space-y-6 mt-6">
            <div className="prose prose-sm max-w-none">
              {Object.entries(contentMap).map(([key, content]) => (
                <div key={key} className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-500 mb-2 font-mono">{key}</div>
                  <div
                    className="text-gray-900"
                    dangerouslySetInnerHTML={{ __html: content.zh || '<span class="text-gray-400">未填写</span>' }}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="en" className="space-y-6 mt-6">
            <div className="prose prose-sm max-w-none">
              {Object.entries(contentMap).map(([key, content]) => (
                <div key={key} className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-500 mb-2 font-mono">{key}</div>
                  <div
                    className="text-gray-900"
                    dangerouslySetInnerHTML={{ __html: content.en || '<span class="text-gray-400">Not filled</span>' }}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              关闭预览
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Open actual website in new tab
                window.open('/', '_blank')
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              查看正式网站
            </Button>
          </div>
          {onOpenVisualEditor && (
            <Button
              onClick={() => {
                onClose()
                onOpenVisualEditor()
              }}
              className="w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 mr-2" />
              打开可视化编辑器
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
