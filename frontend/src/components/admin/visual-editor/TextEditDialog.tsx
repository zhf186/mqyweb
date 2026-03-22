'use client'

/**
 * Text Edit Dialog Component
 * 文字编辑弹窗组件
 * 
 * Features:
 * - Bilingual text editing (Chinese and English)
 * - Save and cancel actions
 * - Loading states
 * - Error handling
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link2, Loader2 } from 'lucide-react'
import type { EditableElement } from '@/lib/visual-editor/types'

interface TextEditDialogProps {
  element: EditableElement | null
  isOpen: boolean
  onClose: () => void
  onSave: (contentZh: string, contentEn: string, linkHref?: string) => Promise<void>
}

export function TextEditDialog({
  element,
  isOpen,
  onClose,
  onSave,
}: TextEditDialogProps) {
  const [contentZh, setContentZh] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [linkHref, setLinkHref] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update content when element changes
  useEffect(() => {
    if (element) {
      setContentZh(element.contentZh || '')
      setContentEn(element.contentEn || '')
      setLinkHref(element.linkHref || '')
      setError(null)
    }
  }, [element])

  // Handle save
  const handleSave = async () => {
    if (!element) return

    // Validate required fields
    if (element.isRequired && !contentZh.trim()) {
      setError('中文内容为必填项')
      return
    }

    // Validate max length
    if (element.maxLength) {
      if (contentZh.length > element.maxLength) {
        setError(`中文内容超过最大长度 ${element.maxLength}`)
        return
      }
      if (contentEn.length > element.maxLength) {
        setError(`英文内容超过最大长度 ${element.maxLength}`)
        return
      }
    }

    setSaving(true)
    setError(null)

    try {
      await onSave(contentZh, contentEn, element.linkHref !== undefined ? linkHref : undefined)
      onClose()
    } catch (err) {
      console.error('Save failed:', err)
      setError(err instanceof Error ? err.message : '保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    // Reset to original values
    if (element) {
      setContentZh(element.contentZh || '')
      setContentEn(element.contentEn || '')
      setLinkHref(element.linkHref || '')
    }
    setError(null)
    onClose()
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    // Escape to cancel
    if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (!element) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[600px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>编辑文字内容</DialogTitle>
          <DialogDescription>
            {element.label}
            {element.isRequired && <span className="text-red-500 ml-1">*</span>}
            {element.maxLength && (
              <span className="text-gray-500 ml-2">
                (最多 {element.maxLength} 字符)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {element.linkHref !== undefined && (
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <Link2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">This is a link button</p>
                <p className="mt-1 text-xs text-blue-800">
                  You can edit both the button text and its destination address below.
                </p>
              </div>
            </div>
          )}

          {/* Chinese Content */}
          <div className="space-y-2">
            <Label htmlFor="content-zh">
              中文内容
              {element.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id="content-zh"
              value={contentZh}
              onChange={(e) => setContentZh(e.target.value)}
              rows={4}
              placeholder="请输入中文内容"
              className="resize-none"
              disabled={saving}
            />
            {element.maxLength && (
              <p className="text-xs text-gray-500 text-right">
                {contentZh.length} / {element.maxLength}
              </p>
            )}
          </div>

          {/* English Content */}
          <div className="space-y-2">
            <Label htmlFor="content-en">English Content</Label>
            <Textarea
              id="content-en"
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={4}
              placeholder="Enter English content"
              className="resize-none"
              disabled={saving}
            />
            {element.maxLength && (
              <p className="text-xs text-gray-500 text-right">
                {contentEn.length} / {element.maxLength}
              </p>
            )}
          </div>

          {element.linkHref !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="content-link">Link Address</Label>
              <Input
                id="content-link"
                value={linkHref}
                onChange={(e) => setLinkHref(e.target.value)}
                placeholder="/contact"
                disabled={saving}
              />
              <p className="text-xs text-gray-500">
                Supports internal paths like `/contact` or full URLs like `https://example.com`.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Field Info */}
          <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded text-xs text-gray-600">
            <p>
              <strong>字段标识:</strong> {element.fieldKey}
            </p>
            <p className="mt-1 text-gray-500">
              提示: 使用 Ctrl+S (或 Cmd+S) 快速保存，Esc 取消
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
