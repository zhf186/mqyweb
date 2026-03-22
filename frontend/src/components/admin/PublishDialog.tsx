'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface PublishDialogProps {
  pageName: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (summary: string) => Promise<void>
}

/**
 * 发布确认对话框
 * Requirements: 5.5, 5.6
 */
export function PublishDialog({
  pageName,
  isOpen,
  onClose,
  onConfirm,
}: PublishDialogProps) {
  const [summary, setSummary] = useState('')
  const [publishing, setPublishing] = useState(false)
  const { toast } = useToast()

  const handlePublish = async () => {
    if (!summary.trim()) {
      toast({
        title: '请填写发布说明',
        description: '发布说明有助于追踪内容变更',
        variant: 'destructive',
      })
      return
    }

    try {
      setPublishing(true)
      await onConfirm(summary)
      toast({
        title: '发布成功',
        description: '已创建发布记录并写入操作日志',
      })
      setSummary('')
      onClose()
    } catch (error) {
      console.error('Failed to publish:', error)
      toast({
        title: '发布失败',
        description: '无法发布内容，请重试',
        variant: 'destructive',
      })
    } finally {
      setPublishing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认发布</DialogTitle>
          <DialogDescription>
            确定要发布 {pageName} 的内容修改吗？
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">发布后的影响：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>系统会为当前页面内容创建一次发布版本快照</li>
                <li>发布说明会写入版本记录和操作日志</li>
                <li>后台统计会显示本次发布动作</li>
                <li>后续回滚时可基于本次发布版本恢复</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">发布说明 *</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="请简要说明本次修改的内容，例如：更新首页标题和描述"
              rows={4}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 text-right">
              {summary.length} / 200
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={publishing}
          >
            取消
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishing || !summary.trim()}
          >
            {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!publishing && <CheckCircle className="mr-2 h-4 w-4" />}
            确认发布
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
