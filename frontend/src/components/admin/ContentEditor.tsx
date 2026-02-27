'use client'

import { useState, useEffect } from 'react'
import { contentApi, type ContentItem } from '@/lib/api/admin'
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
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichTextEditor } from './RichTextEditor'
import { useToast } from '@/hooks/use-toast'
import { Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentEditorProps {
  contentItem: ContentItem
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

/**
 * 内容编辑器组件
 * Requirements: 2.4, 2.5, 2.7, 3.1, 3.2
 */
export function ContentEditor({
  contentItem,
  isOpen,
  onClose,
  onSaved,
}: ContentEditorProps) {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  const [contentZh, setContentZh] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Initialize content when dialog opens
  useEffect(() => {
    if (isOpen) {
      setContentZh(contentItem.contentZh || '')
      setContentEn(contentItem.contentEn || '')
      setLanguage('zh')
    }
  }, [isOpen, contentItem])

  const handleSave = async () => {
    try {
      setSaving(true)
      await contentApi.updateContentItem(contentItem.id, {
        contentZh: contentZh,
        contentEn: contentEn,
        version: contentItem.version || 0,
        changeSummary: '内容更新',
      })
      toast({
        title: '保存成功',
        description: '内容已更新',
      })
      onSaved()
      onClose()
    } catch (error) {
      console.error('Failed to save content:', error)
      toast({
        title: '保存失败',
        description: '无法保存内容，请重试',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const currentContent = language === 'zh' ? contentZh : contentEn
  const setCurrentContent = language === 'zh' ? setContentZh : setContentEn
  const currentLength = currentContent.replace(/<[^>]*>/g, '').length // Strip HTML tags for count
  const isOverLimit = contentItem.maxLength && currentLength > contentItem.maxLength
  const isMissingTranslation = !contentZh || !contentEn

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑内容</DialogTitle>
          <DialogDescription>
            {contentItem.fieldKey}
            {contentItem.isRequired && (
              <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                必填
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Language Tabs */}
          <Tabs value={language} onValueChange={(v) => setLanguage(v as 'zh' | 'en')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="zh" className="relative">
                中文
                {!contentZh && (
                  <AlertCircle className="h-3 w-3 text-yellow-600 ml-1" />
                )}
              </TabsTrigger>
              <TabsTrigger value="en" className="relative">
                English
                {!contentEn && (
                  <AlertCircle className="h-3 w-3 text-yellow-600 ml-1" />
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="zh" className="space-y-4">
              {renderEditor('zh', contentZh, setContentZh)}
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              {renderEditor('en', contentEn, setContentEn)}
            </TabsContent>
          </Tabs>

          {/* Warnings */}
          {isMissingTranslation && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                缺失翻译：请填写中英文内容
              </p>
            </div>
          )}

          {isOverLimit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">
                内容超出建议长度 ({currentLength} / {contentItem.maxLength})
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  function renderEditor(lang: 'zh' | 'en', value: string, onChange: (v: string) => void) {
    const placeholder = lang === 'zh' ? '请输入中文内容...' : 'Please enter English content...'

    switch (contentItem.fieldType) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label>{lang === 'zh' ? '内容' : 'Content'}</Label>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              maxLength={contentItem.maxLength}
            />
            {contentItem.maxLength && (
              <p className={cn(
                'text-xs text-right',
                value.length > contentItem.maxLength ? 'text-red-600 font-semibold' : 'text-gray-500'
              )}>
                {value.length} / {contentItem.maxLength}
                {value.length > contentItem.maxLength && ' - 超出建议长度'}
              </p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label>{lang === 'zh' ? '内容' : 'Content'}</Label>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={6}
              maxLength={contentItem.maxLength}
            />
            {contentItem.maxLength && (
              <p className={cn(
                'text-xs text-right',
                value.length > contentItem.maxLength ? 'text-red-600 font-semibold' : 'text-gray-500'
              )}>
                {value.length} / {contentItem.maxLength}
                {value.length > contentItem.maxLength && ' - 超出建议长度'}
              </p>
            )}
          </div>
        )

      case 'richtext':
        return (
          <div className="space-y-2">
            <Label>{lang === 'zh' ? '内容' : 'Content'}</Label>
            <RichTextEditor
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              maxLength={contentItem.maxLength}
            />
          </div>
        )

      default:
        return null
    }
  }
}
